import { MessageDescriptor } from 'react-intl'

import {
  Form,
  FormItemTypes,
  MultiField,
  ExternalDataProvider,
  Repeater,
  Section,
  SubSection,
  DataProviderItem,
} from '../types/Form'

export function buildForm(data: Omit<Form, 'type'>): Form {
  return { ...data, type: FormItemTypes.FORM }
}

export function buildMultiField(data: Omit<MultiField, 'type'>): MultiField {
  return { ...data, type: FormItemTypes.MULTI_FIELD }
}

export function buildRepeater(data: Omit<Repeater, 'type'>): Repeater {
  return { ...data, type: FormItemTypes.REPEATER }
}

export function buildSection(data: Omit<Section, 'type'>): Section {
  return { ...data, type: FormItemTypes.SECTION }
}

export function buildSubSection(data: Omit<SubSection, 'type'>): SubSection {
  return { ...data, type: FormItemTypes.SUB_SECTION }
}

export function buildExternalDataProvider(
  data: Omit<ExternalDataProvider, 'type' | 'isPartOfRepeater' | 'children'>,
): ExternalDataProvider {
  return {
    ...data,
    isPartOfRepeater: false,
    children: undefined,
    type: FormItemTypes.EXTERNAL_DATA_PROVIDER,
  }
}

export function buildDataProviderItem(
  data: DataProviderItem & {
    title: MessageDescriptor | string
    subTitle?: MessageDescriptor | string
  },
): DataProviderItem {
  return data
}
