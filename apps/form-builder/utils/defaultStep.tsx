import { uuid } from 'uuidv4'
import { IStep } from '../types/interfaces'

export const defaultStep: IStep = {
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
}
