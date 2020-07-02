import { CheckboxField } from './checkbox-field'
import { DateField } from './date-field'
import { IntroductionField } from './introduction-field'
import { RadioField } from './radio-field'
import { TextField } from './text-field'

export type Field =
  | CheckboxField
  | DateField
  | IntroductionField
  | RadioField
  | TextField
