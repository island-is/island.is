import {
  Form,
  FormItemTypes,
  MultiField,
  ExternalDataProvider,
  Repeater,
  Section,
  SubSection,
  DataProviderItem,
  DataProviderPermissionItem,
  DataProviderBuilderItem,
} from '@island.is/application/types'

export const buildForm = (data: Omit<Form, 'type'>): Form => {
  return { ...data, type: FormItemTypes.FORM }
}

export const buildMultiField = (data: Omit<MultiField, 'type'>): MultiField => {
  return { ...data, type: FormItemTypes.MULTI_FIELD }
}

export const buildRepeater = (data: Omit<Repeater, 'type'>): Repeater => {
  return { ...data, type: FormItemTypes.REPEATER }
}

export const buildSection = (data: Omit<Section, 'type'>): Section => {
  return { ...data, type: FormItemTypes.SECTION }
}

export const buildSubSection = (data: Omit<SubSection, 'type'>): SubSection => {
  return { ...data, type: FormItemTypes.SUB_SECTION }
}

export const buildExternalDataProvider = (
  data: Omit<ExternalDataProvider, 'type' | 'isPartOfRepeater' | 'children'>,
): ExternalDataProvider => {
  return {
    ...data,
    isPartOfRepeater: false,
    children: undefined,
    type: FormItemTypes.EXTERNAL_DATA_PROVIDER,
  }
}

export const buildDataProviderItem = (
  data: DataProviderBuilderItem,
): DataProviderItem => {
  return {
    id: data.provider?.externalDataId ?? data.provider?.action ?? '',
    action: data.provider?.actionId,
    order: data.provider?.order,
    title: data.title,
    subTitle: data.subTitle,
    pageTitle: data.pageTitle,
    source: data.source,
  }
}

export const buildDataProviderPermissionItem = (
  data: DataProviderPermissionItem,
): DataProviderPermissionItem => {
  return data
}
