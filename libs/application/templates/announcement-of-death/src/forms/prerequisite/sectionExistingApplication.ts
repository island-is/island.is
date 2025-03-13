import {
  buildCustomField,
  buildMultiField,
  buildSubmitField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
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
          description: m.existingApplicationExists,
          component: 'LinkExistingApplication',
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [],
        }),
      ],
    }),
  ],
})
