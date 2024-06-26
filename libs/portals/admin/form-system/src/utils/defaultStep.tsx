import { uuid } from 'uuidv4'
import { FormSystemStep } from '@island.is/api/schema'

export const defaultStep: FormSystemStep = {
  id: 0,
  guid: uuid(),
  displayOrder: 0,
  name: {
    is: '',
    en: '',
  },
  type: 'Input',
  waitingText: {
    is: '',
    en: '',
  },
  callRuleset: false,
  isHidden: false,
  isCompleted: false,
  groups: [],
}
