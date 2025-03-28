export function extractPropsAndEvents(vdom) {
  const { on: events = {}, ...props } = vdom.props;
  delete props.key;
  return { props, events };
}
