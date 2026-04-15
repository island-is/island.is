import {
  buildMultiField,
  buildSection,
  buildTableRepeaterField,
  getValueViaPath,
} from '@island.is/application/core'
import type { Application } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { isCourseForProfessionals } from '../../utils/isCourseForProfessionals'

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
              application.answers,
              'userInformation.email',
            )
            const phone = getValueViaPath(
              application.answers,
              'userInformation.phone',
            )

            if (!name || !nationalId || !email || !phone) {
              return undefined
            }

            const workplace =
              getValueViaPath<string>(application.answers, 'workplace') ?? ''
            const jobTitle =
              getValueViaPath<string>(application.answers, 'jobTitle') ?? ''

            return [
              {
                nationalIdWithName: {
                  name,
                  nationalId,
                  email,
                  phone,
                },
                workplace,
                jobTitle,
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
            workplace: {
              component: 'input',
              label: m.participant.participantWorkplace,
              width: 'half',
              displayInTable: false,
              condition: (application: Application) =>
                isCourseForProfessionals(application.answers),
              defaultValue: (application: Application) =>
                getValueViaPath<string>(application.answers, 'workplace') ?? '',
            },
            jobTitle: {
              component: 'input',
              label: m.participant.participantJobTitle,
              width: 'half',
              displayInTable: false,
              condition: (application: Application) =>
                isCourseForProfessionals(application.answers),
              defaultValue: (application: Application) =>
                getValueViaPath<string>(application.answers, 'jobTitle') ?? '',
            },
          },
        }),
      ],
    }),
  ],
})
