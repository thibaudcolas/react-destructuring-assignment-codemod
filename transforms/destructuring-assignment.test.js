"use strict";

jest.autoMockOff();

const { runInlineTest } = require("jscodeshift/dist/testUtils");

const transform = require("./destructuring-assignment");

const compare = (input, output) =>
  runInlineTest(transform, {}, { source: input }, output);

describe("destructuring-assignment", () => {
  it("doNothing", () => {
    compare(
      `function doNothing(props) {
      return props;
    }`,
      `function doNothing(props) {
      return props;
    }`,
    );
  });

  it.skip("ShouldDestructure", () => {
    compare(
      `function ShouldDestructure(props) {
      return <div className={props.foo} />;
    }`,
      `function ShouldDestructure({ foo }) {
      return <div className={foo} />;
    }`,
    );
  });

  it("ShouldDestructureClass", () => {
    compare(
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
  });

  it("ShouldDestructureClassConstructor", () => {
    compare(
      `class ShouldDestructureClassConstructor extends React.Component {
      constructor(props) {
        super(props);

        console.log(this.props.foo);
      }
      render() {
        const { foo } = this.props;
        return <div className={foo} />;
      }
    }`,
      `class ShouldDestructureClassConstructor extends React.Component {
      constructor(props) {
        super(props);
        const { foo } = this.props;

        console.log(foo);
      }
      render() {
        const { foo } = this.props;
        return <div className={foo} />;
      }
    }`,
    );
  });

  it.skip("ShouldDestructureAndRemoveDuplicateDeclarationClass", () => {
    compare(
      `class ShouldDestructureAndRemoveDuplicateDeclarationClass extends React.Component {
      render() {
        const fizz = { buzz: "buzz" };
        const bar = this.props.bar;
        const baz = this.props.bizzaz;
        const buzz = fizz.buzz;
        return <div className={this.props.foo} bar={bar} baz={baz} buzz={buzz} />;
      }
    }`,
      `class ShouldDestructureAndRemoveDuplicateDeclarationClass extends React.Component {
      render() {
        const {
          bar,
          bizzaz,
          foo
        } = this.props;
        const fizz = { buzz: "buzz" };
        const baz = bizzaz;
        const buzz = fizz.buzz;
        return <div className={foo} bar={bar} baz={baz} buzz={buzz} />;
      }
    }`,
    );
  });

  it("UsesThisDotProps", () => {
    compare(
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
  });

  it("DestructuresThisDotProps", () => {
    compare(
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
  });

  it("HasShadowPropsClass", () => {
    compare(
      `const shadow = "shadow";

    class HasShadowPropsClass extends React.Component {
      render() {
        return <div shadow={shadow} propsShadow={this.props.shadow} />;
      }
    }`,
      `const shadow = "shadow";

    class HasShadowPropsClass extends React.Component {
      render() {
        return <div shadow={shadow} propsShadow={this.props.shadow} />;
      }
    }`,
    );
  });

  it("PureWithTypesClass", () => {
    compare(
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
});
