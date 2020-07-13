import { Field } from './Fields'
import { Form, MultiField, Repeater, Section, SubSection } from './Form'

export type FormNode =
  | Form
  | Section
  | SubSection
  | Repeater
  | MultiField
  | Field

export type FormLeaf = MultiField | Field | Repeater
