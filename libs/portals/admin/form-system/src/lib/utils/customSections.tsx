import { FormSystemSection } from '@island.is/api/schema'

export const urlSettingsStep: FormSystemSection = {
  id: 'Urls',
  displayOrder: 4,
  name: {
    is: 'Slóðir',
    en: 'Urls',
  },
  waitingText: {
    is: '',
    en: '',
  },
  isHidden: false,
  isCompleted: false,
}

export const lifetimeSettingsStep: FormSystemSection = {
  id: 'Lifetime',
  displayOrder: 5,
  name: {
    is: 'Líftími umsókna',
    en: 'Application Lifetime',
  },
  waitingText: {
    is: '',
    en: '',
  },
  isHidden: false,
  isCompleted: false,
}
