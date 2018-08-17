"use strict";

var React = require("React");

const shadow = "shadow";

function doSomething(props) {
  return props;
}

function ShouldDestsructure({ foo }) {
  return <div className={foo} />;
}

class ShouldDestsructureClass extends React.Component {
  render() {
    const { foo } = this.props;
    return <div className={foo} />;
  }
}

function ShouldDestructureAndRemoveDuplicateDeclaration({ bar, bizzaz, foo }) {
  const fizz = { buzz: "buzz" };
  const baz = bizzaz;
  const buzz = fizz.buzz;
  return <div className={foo} bar={bar} baz={baz} buzz={buzz} />;
}

class ShouldDestructureAndRemoveDuplicateDeclarationClass extends React.Component {
  render() {
    const { bar, bizzaz, foo } = this.props;
    const fizz = { buzz: "buzz" };
    const baz = bizzaz;
    const buzz = fizz.buzz;
    return <div className={foo} bar={bar} baz={baz} buzz={buzz} />;
  }
}

function UsesProps(props) {
  doSomething(props);
  return <div className={props.foo} />;
}

class UsesThisDotProps extends React.Component {
  render() {
    doSomething(this.props);
    return <div className={this.props.foo} />;
  }
}

function DestructuresProps(props) {
  const { bar } = props;
  return <div className={props.foo} bar={bar} />;
}

class DestructuresThisDotProps extends React.Component {
  // would be nice to destructure in this case
  render() {
    const { bar } = this.props;
    return <div className={this.props.foo} bar={bar} />;
  }
}

function HasShadowProps(props) {
  return <div shadow={shadow} propsShadow={props.shadow} />;
}

class HasShadowPropsClass extends React.Component {
  render() {
    return <div shadow={shadow} propsShadow={this.props.shadow} />;
  }
}

function PureWithTypes({ foo: string }) {
  return <div className={foo} />;
}

class PureWithTypesClass extends React.Component {
  props: { foo: string };
  render() {
    const { foo } = this.props;
    return <div className={foo} />;
  }
}
