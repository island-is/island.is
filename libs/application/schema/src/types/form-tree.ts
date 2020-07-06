import { Field } from './fields'
import { Form, MultiField, Repeater, Section, SubSection } from './form'

export type FormNode =
  | Form
  | Section
  | SubSection
  | Repeater
  | MultiField
  | Field

export type FormScreen = MultiField | Field | Repeater
