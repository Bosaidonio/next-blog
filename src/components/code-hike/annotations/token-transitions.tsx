// from: https://codehike.org/docs/code/token-transitions

import { AnnotationHandler, InnerToken } from "codehike/code"
import { SmoothPre } from "./token-transitions.client"

export const TokenTransitions: AnnotationHandler = {
  name: "token-transitions",
  PreWithRef: SmoothPre,
  Token: (props) => {
    return  <InnerToken className="token-transition" merge={props}   />
  },
}
