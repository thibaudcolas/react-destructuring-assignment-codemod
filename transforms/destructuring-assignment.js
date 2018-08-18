const { isKeyword } = require("./utils/keywords");

module.exports = function(file, api) {
  const j = api.jscodeshift;
  const { statement } = j.template;
  const ReactUtils = require("./utils/ReactUtils")(j);

  const needsThisDotProps = path =>
    path
      .find(j.Identifier, {
        name: "props",
      })
      .filter(p => p.parentPath.parentPath.value.type !== "MemberExpression")
      .size() > 0;

  const isDuplicateDeclaration = (path, pre) => {
    if (path && path.value && path.value.id && path.value.init) {
      const initName = pre
        ? path.value.init.property && path.value.init.property.name
        : path.value.init.name;
      return path.value.id.name === initName;
    }
    return false;
  };

  const getPropNames = path => {
    const propNames = new Set();
    path
      .find(j.MemberExpression, {
        object: {
          property: {
            name: "props",
          },
        },
      })
      .forEach(p => {
        propNames.add(p.value.property.name);
      });
    return propNames;
  };

  const getDuplicateNames = path => {
    const duplicates = new Set();
    path
      .find(j.VariableDeclarator)
      .filter(p => isDuplicateDeclaration(p, true))
      .forEach(p => {
        duplicates.add(p.value.id.name);
      });
    return duplicates;
  };

  const getAssignmentNames = path => {
    const assignmentNames = new Set();
    path
      .find(j.Identifier)
      .filter(p => {
        if (p.value.type === "JSXIdentifier") {
          return false;
        }
        if (
          !(p.parentPath.value.object && p.parentPath.value.object.property)
        ) {
          return true;
        }
        return p.parentPath.value.object.property.name !== "props";
      })
      .forEach(p => {
        assignmentNames.add(p.value.name);
      });
    return assignmentNames;
  };

  const hasAssignmentsThatShadowProps = path => {
    const propNames = getPropNames(path);
    const assignmentNames = getAssignmentNames(path);
    const duplicates = getDuplicateNames(path);
    return Array.from(propNames).some(
      prop => !duplicates.has(prop) && assignmentNames.has(prop),
    );
  };

  return (
    j(file.source)
      .find(j.FunctionExpression)
      // .filter(p => !needsThisDotProps(j(p.value.body.body)))
      .filter(p => !hasAssignmentsThatShadowProps(j(p.value.body.body)))
      .replaceWith(p => {
        const root = j(p.value);
        const variablesToReplace = {};

        // Figure out if the variable was defined from props, so that we can re-use that definition.
        const isFromProps = (name, resolvedScope) => {
          return resolvedScope.getBindings()[name].every(p => {
            const decl = j(p).closest(j.VariableDeclarator);
            // What happens when our VariableDeclarator is too high up the parent AST?

            if (!decl.size()) return false;
            const node = decl.nodes()[0];

            if (
              !(
                node.init.type == "MemberExpression" &&
                node.init.object.type == "ThisExpression" &&
                node.init.property.name == "props"
              )
            )
              return false;

            // Check for the case where it could be aliased (i.e.) { baz: foo } = this.props;
            // In this case, we won't do a substitution.
            if (
              p.parentPath.value.type == "Property" &&
              p.parentPath.value.key.name !== name
            )
              return false;

            return true;
          });
        };

        // Transform "this.props.xyz" to "xyz", and record what we've transformed.
        // Transform as long as we don't have "xyz" already defined in the scope.
        root
          .find(j.MemberExpression, {
            object: {
              type: "MemberExpression",
              object: { type: "ThisExpression" },
              property: { name: "props" },
            },
          })
          .filter(e => {
            const resolvedScope = e.scope.lookup(e.value.property.name);
            // If the scope is null, that means that this property isn't defined in the scope yet,
            // and we can use it. Otherwise, if it is defined, we should see if it was defined from `this.props`
            // if none of these cases are true, we can't do substitution.
            return (
              resolvedScope == null ||
              isFromProps(e.value.property.name, resolvedScope)
            );
          })
          // Ensure that our substitution won't cause us to define a keyword, i.e. `this.props.while` won't
          // get converted into `while`.
          .filter(p => !isKeyword(p.value.property.name))
          // Now, do the replacement, `this.props.xyz` => `xyz`.
          .replaceWith(p => p.value.property)
          // Finally, mark the variable as something we will need to define earlier in the function,
          // if it's not already defined.
          .forEach(p => {
            // Is this prop already defined somewhere else.
            if (!p.scope.lookup(p.value.name))
              variablesToReplace[p.value.name] = true;
          });

        // Create property definitions for variables that we've replaced.
        const properties = Object.keys(variablesToReplace)
          .sort()
          .map(k => {
            const prop = j.property("init", j.identifier(k), j.identifier(k));
            prop.shorthand = true;
            return prop;
          });

        // We have no properties to inject, so we can bail here.
        if (!properties.length) return p.value;

        // See if we already have a VariableDeclarator like { a, b, c } = this.props;
        const propDefinitions = root.find(j.VariableDeclarator, {
          id: { type: "ObjectPattern" },
          init: {
            type: "MemberExpression",
            object: { type: "ThisExpression" },
            property: { name: "props" },
          },
        });

        if (propDefinitions.size()) {
          const nodePath = propDefinitions.paths()[0];
          const node = nodePath.value;
          const newPattern = j.objectPattern(
            node.id.properties.concat(properties),
          );
          nodePath.replace(j.variableDeclarator(newPattern, node.init));
          return p.value;
        }

        // Otherwise, we'll have to create our own, as none were suitable for use.
        // Create the variable definition `const { xyz } = this.props;`
        const decl = statement`const { ${properties} } = this.props;`;

        // Add the variable definition to the top of the function expression body.
        return j.functionExpression(
          p.value.id,
          p.value.params,
          j.blockStatement([decl].concat(p.value.body.body)),
        );
      })
      .toSource()
  );
};
