import {
  type TemplateListType,
  TemplateListTypesEnum,
} from '@island.is/form-system/shared'

type TemplateListItem = {
  label: { is: string; en: string }
  description: { is: string; en: string }
  value: string
  isSelected: boolean
}

export const TemplateListItems: Record<TemplateListType, TemplateListItem[]> = {
  [TemplateListTypesEnum.YES_NO]: [
    {
      label: { is: 'Já', en: 'Yes' },
      description: { is: '', en: '' },
      value: 'yes',
      isSelected: false,
    },
    {
      label: { is: 'Nei', en: 'No' },
      description: { is: '', en: '' },
      value: 'no',
      isSelected: false,
    },
  ],
  [TemplateListTypesEnum.ACCEPT_DECLINE]: [
    {
      label: { is: 'Ég samþykki', en: 'I accept' },
      description: { is: '', en: '' },
      value: 'accept',
      isSelected: false,
    },
    {
      label: { is: 'Ég samþykki ekki', en: 'I decline' },
      description: { is: '', en: '' },
      value: 'decline',
      isSelected: false,
    },
  ],
}
