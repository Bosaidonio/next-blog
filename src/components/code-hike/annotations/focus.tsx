import { AnnotationHandler, InnerLine } from 'codehike/code'
import { PreWithFocus } from "./focus.client"
export const Focus: AnnotationHandler = {
  name: "focus",
  Line: (props) => {
    return <InnerLine
      merge={props}
      className="px-2"
    />
  },
  AnnotatedLine: ({ annotation, ...props }) => {
    return <InnerLine merge={props} data-focus={true} />
  }
}
