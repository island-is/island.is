import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
  buildSubmitField,
  YesOrNoEnum,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { applicationAnswers } from '../../shared'
import { formatNationalId, formatPhoneNumber } from '../../utils/utils'
import * as m from '../../lib/messages'

export const PreSignatureInfoSection = buildSection({
  id: 'preSignatureInfo',
  title: m.inReview.preSignatureInfo.sectionName,
  children: [
    buildMultiField({
      id: 'preSignatureInfo',
      title: m.inReview.preSignatureInfo.sectionName,
      description: m.inReview.preSignatureInfo.pageDescription,
      children: [
        buildDescriptionField({
          id: 'preSignatureInfo.info',
          title: m.inReview.preSignatureInfo.infoHeading,
          description: m.inReview.preSignatureInfo.infoBullets,
          titleVariant: 'h3',
          space: 0,
        }),
        buildStaticTableField({
          title: m.inReview.preSignatureInfo.tableTitle,
          marginTop: 6,
          header: [
            m.misc.fullName,
            m.misc.nationalId,
            m.misc.phoneNumber,
            m.misc.email,
          ],
          rows: (application) => {
            const { landlords, tenants } = applicationAnswers(
              application.answers,
            )

            const signees = [...(landlords ?? []), ...(tenants ?? [])]

            return signees.map((person) => [
              person.nationalIdWithName.name ?? '',
              formatNationalId(person.nationalIdWithName.nationalId || '') ??
                '',
              formatPhoneNumber(person.phone || '') ?? '',
              person.email ?? '',
            ])
          },
        }),
        buildCheckboxField({
          id: 'preSignatureInfo.statement',
          required: true,
          options: [
            {
              value: YesOrNoEnum.YES,
              label: m.inReview.preSignatureInfo.statementLabel,
            },
          ],
          large: true,
          marginTop: 9,
        }),
        buildSubmitField({
          id: 'preSignatureInfo.buttons',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.inReview.preSignatureInfo.submitButtonText,
              type: 'sign',
            },
          ],
        }),
      ],
    }),
  ],
})
