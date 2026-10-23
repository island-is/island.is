import { FieldComponents, FieldTypes } from '@island.is/application/types'
import type { ScreenIntrospection } from '../types/translationWorkspace'
import { buildPreviewFieldFromScreen } from './buildPreviewFieldFromScreen'

const screenWithTitle = (
  type: string,
  component: string,
): ScreenIntrospection => ({
  id: 'passportName',
  type,
  component,
  title: 'Nafn',
  description: null,
  pageTitle: null,
  subTitle: null,
  subDescription: null,
  checkboxLabel: null,
  width: 'half',
  space: null,
  messageDescriptors: [
    {
      id: 'paa.application:personalInfo.name',
      defaultMessage: 'Nafn',
    },
  ],
})

describe('buildPreviewFieldFromScreen', () => {
  it.each([
    [FieldTypes.TEXT, FieldComponents.TEXT],
    [FieldTypes.PHONE, FieldComponents.PHONE],
    [FieldTypes.DATE, FieldComponents.DATE],
  ])(
    'passes %s title as a message descriptor so live translations apply',
    (type, component) => {
      const field = buildPreviewFieldFromScreen(
        screenWithTitle(type, component),
      )

      expect(field?.title).toEqual({
        id: 'paa.application:personalInfo.name',
        defaultMessage: 'Nafn',
      })
    },
  )
})
