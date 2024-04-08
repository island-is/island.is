import { uuid } from 'uuidv4'
import { IStep } from '../types/interfaces'
import { FormSystemStep } from '@island.is/api/schema'

export const defaultStep: FormSystemStep = {
  id: 0,
  guid: uuid(),
  displayOrder: 0,
  name: {
    is: '',
    en: '',
  },
  type: 'Innsláttur',
  waitingText: {
    is: '',
    en: '',
  },
  callRuleset: false,
  isHidden: false,
  isCompleted: false,
  groups: []
}
