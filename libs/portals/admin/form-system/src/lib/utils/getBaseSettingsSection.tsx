import { FormSystemSection } from '@island.is/api/schema'

export const baseSettingsStep: FormSystemSection = {
  id: 'BaseSettings',
  displayOrder: -1,
  name: {
    is: 'Grunnstillingar',
    en: 'Base settings',
  },
  waitingText: {
    is: '',
    en: '',
  },
  isHidden: false,
  isCompleted: false,
}
