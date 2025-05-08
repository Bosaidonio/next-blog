import {AnnotationHandler } from "codehike/code"

export const Link: AnnotationHandler = {
  name: "link",
  Inline: ({ annotation, children }) => {
    const { query } = annotation
    return <a href={query} >{children}</a>
  },
}
