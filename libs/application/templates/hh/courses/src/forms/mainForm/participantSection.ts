import {
  buildMultiField,
  buildSection,
  buildTableRepeaterField,
  getValueViaPath,
} from '@island.is/application/core'
import type { Application } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { isCourseForProfessionals } from '../../utils/isCourseForProfessionals'
import { MAX_PARTICIPANTS_PER_APPLICATION } from '../../utils/constants'

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
          maxRows: MAX_PARTICIPANTS_PER_APPLICATION,
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
            columns: [
              { header: m.participant.participantName, value: 'name' },
              {
                header: m.participant.participantNationalId,
                value: 'nationalId',
              },
              { header: m.participant.participantEmail, value: 'email' },
              { header: m.participant.participantPhone, value: 'phone' },
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
              condition: ({ application }) =>
                isCourseForProfessionals(application.answers),
              defaultValue: ({ application }) =>
                getValueViaPath<string>(application.answers, 'workplace') ?? '',
            },
            jobTitle: {
              component: 'input',
              label: m.participant.participantJobTitle,
              width: 'half',
              displayInTable: false,
              condition: ({ application }) =>
                isCourseForProfessionals(application.answers),
              defaultValue: ({ application }) =>
                getValueViaPath<string>(application.answers, 'jobTitle') ?? '',
            },
          },
        }),
      ],
    }),
  ],
})
