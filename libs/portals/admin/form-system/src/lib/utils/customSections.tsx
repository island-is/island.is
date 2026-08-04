import { FormSystemSection } from '@island.is/api/schema'

export const urlSettingsStep: FormSystemSection = {
  id: 'Urls',
  displayOrder: 0,
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
  displayOrder: 0,
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

export const delegationSettingsStep: FormSystemSection = {
  id: 'Delegation',
  displayOrder: 0,
  name: {
    is: 'Umboð',
    en: 'Delegation',
  },
  waitingText: {
    is: '',
    en: '',
  },
  isHidden: false,
  isCompleted: false,
}
