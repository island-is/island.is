import {
  Application,
  buildCustomField,
  buildMultiField,
  buildSubmitField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'

export const sectionExistingApplication = buildSubSection({
  id: 'applicationFor',
  title: m.existingApplicationTitle,
  condition: (_answers, externalData) => {
    const existing =
      getValueViaPath<Application[]>(
        externalData,
        'existingApplication.data',
        [],
      ) ?? []

    const estates =
      getValueViaPath<Application[]>(
        externalData,
        'syslumennOnEntry.data.estates',
        [],
      ) ?? []
    return existing.length > 0 || estates?.length > 1
  },
  children: [
    buildMultiField({
      id: 'existingInfo',
      title: m.existingApplicationTitle,
      children: [
        buildCustomField({
          id: 'existingApplicationLink',
          title: '',
          description: m.existingApplicationExists,
          component: 'LinkExistingApplication',
        }),
        buildSubmitField({
          id: 'submit',
          title: '',
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [],
        }),
      ],
    }),
  ],
})
