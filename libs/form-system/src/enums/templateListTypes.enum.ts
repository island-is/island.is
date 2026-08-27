export const TemplateListTypesEnum = {
  YES_NO: 'YES_NO',
  ACCEPT_DECLINE: 'ACCEPT_DECLINE',
} as const

export type TemplateListType =
  typeof TemplateListTypesEnum[keyof typeof TemplateListTypesEnum]
