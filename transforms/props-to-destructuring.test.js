"use strict";

jest.autoMockOff();

const { defineInlineTest } = require("jscodeshift/dist/testUtils");

const transform = require("./props-to-destructuring");

describe("props-to-destructuring", () => {
  defineInlineTest(
    transform,
    {},
    `function doSomething(props) {
      return props;
    }`,
    `function doSomething(props) {
      return props;
    }`,
  );
  defineInlineTest(
    transform,
    {},
    `class ShouldDestructureClass extends React.Component {
      render() {
        return <div className={this.props.foo} />;
      }
    }`,
    `class ShouldDestructureClass extends React.Component {
      render() {
        const { foo } = this.props;
        return <div className={foo} />;
      }
    }`,
  );
  // defineInlineTest(
  //   transform,
  //   {},
  //   `class ShouldDestructureAndRemoveDuplicateDeclarationClass extends React.Component {
  //     render() {
  //       const fizz = { buzz: "buzz" };
  //       const bar = this.props.bar;
  //       const baz = this.props.bizzaz;
  //       const buzz = fizz.buzz;
  //       return <div className={this.props.foo} bar={bar} baz={baz} buzz={buzz} />;
  //     }
  //   }`,
  //   `class ShouldDestructureAndRemoveDuplicateDeclarationClass extends React.Component {
  //     render() {
  //       const { bar, bizzaz, foo } = this.props;
  //       const fizz = { buzz: "buzz" };
  //       const baz = bizzaz;
  //       const buzz = fizz.buzz;
  //       return <div className={foo} bar={bar} baz={baz} buzz={buzz} />;
  //     }
  //   }`,
  // );
  defineInlineTest(
    transform,
    {},
    `class UsesThisDotProps extends React.Component {
      render() {
        doSomething(this.props);
        return <div className={this.props.foo} />;
      }
    }`,
    `class UsesThisDotProps extends React.Component {
      render() {
        const { foo } = this.props;
        doSomething(this.props);
        return <div className={foo} />;
      }
    }`,
  );
  defineInlineTest(
    transform,
    {},
    `class DestructuresThisDotProps extends React.Component {
      render() {
        const { bar } = this.props;
        return <div className={this.props.foo} bar={bar} />;
      }
    }`,
    `class DestructuresThisDotProps extends React.Component {
      render() {
        const {
          bar,
          foo
        } = this.props;
        return <div className={foo} bar={bar} />;
      }
    }`,
  );
  // defineInlineTest(
  //   transform,
  //   {},
  //   `const shadow = "shadow";

  //   class HasShadowPropsClass extends React.Component {
  //     render() {
  //       return <div shadow={shadow} propsShadow={this.props.shadow} />;
  //     }
  //   }`,
  //   `const shadow = "shadow";

  //   class HasShadowPropsClass extends React.Component {
  //     render() {
  //       return <div shadow={shadow} propsShadow={this.props.shadow} />;
  //     }
  //   }`,
  // );
  defineInlineTest(
    transform,
    {},
    `class PureWithTypesClass extends React.Component {
      props: { foo: string };
      render() {
        return <div className={this.props.foo} />;
      }
    }`,
    `class PureWithTypesClass extends React.Component {
      props: { foo: string };
      render() {
        const { foo } = this.props;
        return <div className={foo} />;
      }
    }`,
  );
});
