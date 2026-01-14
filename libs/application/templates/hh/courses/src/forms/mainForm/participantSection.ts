import {
  buildMultiField,
  buildSection,
  buildTableRepeaterField,
  getValueViaPath,
} from '@island.is/application/core'
import type { Application } from '@island.is/application/types'
import { m } from '../../lib/messages'

export const participantSection = buildSection({
  id: 'participantSection',
  title: m.participant.sectionTitle,
  children: [
    buildMultiField({
      id: 'participantSectionMultiField',
      title: m.participant.sectionTitle,
      children: [
        buildTableRepeaterField({
          id: 'participantList',
          defaultValue: (application: Application) => {
            const name = getValueViaPath(
              application.externalData,
              'nationalRegistry.data.fullName',
            )
            const nationalId = getValueViaPath(
              application.externalData,
              'nationalRegistry.data.nationalId',
            )
            const email = getValueViaPath(
              application.externalData,
              'userInformation.email',
            )
            const phone = getValueViaPath(
              application.externalData,
              'userInformation.phone',
            )
            const healthcenter = getValueViaPath(
              application.externalData,
              'userInformation.healthcenter',
            )

            if (!name || !nationalId || !email || !phone || !healthcenter) {
              return undefined
            }

            return [
              {
                nationalIdWithName: {
                  name,
                  nationalId,
                  email,
                  phone,
                },
                healthcenter,
              },
            ]
          },
          table: {
            rows: ['name', 'nationalId', 'email', 'phone'],
            header: [
              m.participant.participantName,
              m.participant.participantNationalId,
              m.participant.participantEmail,
              m.participant.participantPhone,
            ],
          },
          fields: {
            nationalIdWithName: {
              component: 'nationalIdWithName',
              label: m.participant.participantNationalId,
              searchPersons: true,
              required: true,
              showEmailField: true,
              showPhoneField: true,
              phoneRequired: true,
              emailRequired: true,
            },
          },
        }),
      ],
    }),
  ],
})
