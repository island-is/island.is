import { uuid } from 'uuidv4'

export const baseSettingsStep = {
  id: 99999,
  guid: uuid(),
  displayOrder: -1,
  name: {
    is: 'Grunnstillingar',
    en: 'Base settings',
  },
  type: 'BaseSetting',
  waitingText: {
    is: '',
    en: '',
  },
  callRuleset: false,
  isHidden: false,
  isCompleted: false,
}
