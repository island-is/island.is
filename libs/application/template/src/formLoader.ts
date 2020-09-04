import * as forms from './forms/'
import { FormType } from './forms/'
import { Form } from './types/Form'

export function getFormByTypeId(formTypeId: FormType): Form | null {
  return forms[formTypeId] || null
}
