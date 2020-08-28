import * as forms from './forms/'
import { FormType } from './forms/'

export function getFormByTypeId(formTypeId: FormType) {
  return forms[formTypeId] || null
}
