import { InlineFold } from './fold.client'
import { AnnotationHandler } from 'codehike/code'

export const Fold: AnnotationHandler = {
  name: "fold",
  Inline: InlineFold,
}
