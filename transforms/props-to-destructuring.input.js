"use strict";

var React = require("React");

const shadow = "shadow";

function ShouldDestructure(props) {
  return <div className={props.foo} />;
}

function ShouldDestructureAndRemoveDuplicateDeclaration(props) {
  const fizz = { buzz: "buzz" };
  const bar = props.bar;
  const baz = props.bizzaz;
  const buzz = fizz.buzz;
  return <div className={props.foo} bar={bar} baz={baz} buzz={buzz} />;
}

function UsesProps(props) {
  doSomething(props);
  return <div className={props.foo} />;
}

// would be nice to destructure in this case
function DestructuresProps(props) {
  const { bar } = props;
  return <div className={props.foo} bar={bar} />;
}

function HasShadowProps(props) {
  return <div shadow={shadow} propsShadow={props.shadow} />;
}

function PureWithTypes(props: { foo: string }) {
  return <div className={props.foo} />;
}
