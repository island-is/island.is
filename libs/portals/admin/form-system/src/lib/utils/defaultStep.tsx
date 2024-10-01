import { uuid } from 'uuidv4'
import { FormSystemSection, FormSystemSectionDtoSectionTypeEnum } from '@island.is/api/schema'

export const defaultStep: FormSystemSection = {
  id: uuid(),
  displayOrder: 0,
  name: {
    is: '',
    en: '',
  },
  sectionType: FormSystemSectionDtoSectionTypeEnum.Input,
  waitingText: {
    is: '',
    en: '',
  },
  isHidden: false,
  isCompleted: false,
}
