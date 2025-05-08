import { AnnotationHandler, InnerLine } from 'codehike/code'
export const Line: AnnotationHandler = {
  name: "line",
  Line: (props) => {
    return <InnerLine
      merge={props}
      className="line"
    />
  },
}
