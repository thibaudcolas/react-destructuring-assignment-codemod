"use strict";

var React = require("React");

const shadow = "shadow";

function doSomething(props) {
  return props;
}

function ShouldDestsructure(props) {
  return <div className={props.foo} />;
}

class ShouldDestsructureClass extends React.Component {
  render() {
    return <div className={this.props.foo} />;
  }
}

function ShouldDestructureAndRemoveDuplicateDeclaration(props) {
  const fizz = { buzz: "buzz" };
  const bar = props.bar;
  const baz = props.bizzaz;
  const buzz = fizz.buzz;
  return <div className={props.foo} bar={bar} baz={baz} buzz={buzz} />;
}

class ShouldDestructureAndRemoveDuplicateDeclarationClass extends React.Component {
  render() {
    const fizz = { buzz: "buzz" };
    const bar = this.props.bar;
    const baz = this.props.bizzaz;
    const buzz = fizz.buzz;
    return <div className={this.props.foo} bar={bar} baz={baz} buzz={buzz} />;
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

// would be nice to destructure in this case
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

function PureWithTypes(props: { foo: string }) {
  return <div className={props.foo} />;
}

class PureWithTypesClass extends React.Component {
  props: { foo: string };
  render() {
    return <div className={this.props.foo} />;
  }
}
