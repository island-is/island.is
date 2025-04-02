import { uuid } from 'uuidv4'
import { FormSystemSection } from '@island.is/api/schema'
import { SectionTypes } from '@island.is/form-system/enums'

export const defaultStep: FormSystemSection = {
  id: uuid(),
  displayOrder: 0,
  name: {
    is: '',
    en: '',
  },
  sectionType: SectionTypes.INPUT,
  waitingText: {
    is: '',
    en: '',
  },
  isHidden: false,
  isCompleted: false,
}
