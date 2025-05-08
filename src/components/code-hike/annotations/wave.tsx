import {AnnotationHandler } from "codehike/code"

export const Wave: AnnotationHandler = {
  name: "wave",
  Inline: ({ annotation, children }) => {
    return <span className="underline decoration-wavy" style={{
      textDecorationColor: annotation.query || 'hotpink',
      textDecorationThickness: '2px'
    }}>{children}</span>
  },
}
