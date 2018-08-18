"use strict";

var React = require("React");

const shadow = "shadow";

function ShouldDestructure({ foo }) {
  return <div className={foo} />;
}

function ShouldDestructureAndRemoveDuplicateDeclaration({ bar, bizzaz, foo }) {
  const fizz = { buzz: "buzz" };
  const baz = bizzaz;
  const buzz = fizz.buzz;
  return <div className={foo} bar={bar} baz={baz} buzz={buzz} />;
}

function UsesProps(props) {
  doSomething(props);
  return <div className={props.foo} />;
}

function DestructuresProps(props) {
  const { bar } = props;
  return <div className={props.foo} bar={bar} />;
}

function HasShadowProps(props) {
  return <div shadow={shadow} propsShadow={props.shadow} />;
}

function PureWithTypes({ foo: string }) {
  return <div className={foo} />;
}
