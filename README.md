# react/destructuring-assignment codemod

> A jscodeshift codemod to destructure assignments of props, state, and context

## Usage

```sh
npm install -g jscodeshift
git clone https://github.com/thibaudcolas/react-destructuring-assignment-codemod.git
cd react-destructuring-assignment-codemod
npm install
jscodeshift -t <codemod-script> <path>
```

- `codemod-script` - path to the transform file, see available scripts below.
- `path` - files or directory to transform.
- Use the `-d` option for a dry-run and use `-p` to print the output for comparison.
- Use the `--extensions` option if your files have different extensions than `.js` (for example, `--extensions js,jsx`).
- If you use flowtype, you might also need to use `--parser=flow`.
- See all available [jscodeshift options](https://github.com/facebook/jscodeshift#usage-cli).

## Included Scripts

### `react-destructuring-assignment`

This converts all usage of `props`, and `state` to use destructuring assignment, addressing the corresponding linting rule from `eslint-plugin-react`: [`react/destructuring-assignment`](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md) with the `always` setting.

For example,

```js
// Before.
const MyComponent = props => {
  return <div id={props.id} />;
};
// After.
const MyComponent = ({ id }) => {
  return <div id={id} />;
};
```
