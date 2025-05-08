import { AnnotationHandler, InnerLine } from 'codehike/code'
export const Focus: AnnotationHandler = {
  name: "focus",
  Line: (props) => {
    return <InnerLine
      merge={props}
      className="px-2"
    />
  },
  AnnotatedLine: ({ annotation: _annotation, ...props }) => {
    return <InnerLine merge={props} data-focus={true} />
  }
}
