import { FormSystemSection } from '@island.is/api/schema'
import { SectionTypes } from '@island.is/form-system-enums'

export const baseSettingsStep: FormSystemSection = {
  id: 'BaseSettings',
  sectionType: SectionTypes.BASE_SETTINGS,
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
