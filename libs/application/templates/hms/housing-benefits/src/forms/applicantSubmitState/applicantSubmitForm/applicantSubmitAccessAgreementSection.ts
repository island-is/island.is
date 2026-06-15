import {
  buildFieldsRepeaterField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import * as kennitala from 'kennitala'
import * as m from '../../../lib/messages'
import {
  applicantSubmitAccessAgreementChildOptions,
  applicantSubmitAccessAgreementDescription,
  applicantSubmitAccessAgreementRepeaterMaxRows,
  applicantSubmitAccessAgreementRepeaterMinRows,
} from '../../../utils/applicantSubmitAccessAgreementUtils'
import {
  getNationalIdPrefix,
  shouldShowApplicantSubmitAccessAgreementSection,
} from '../../../utils/assigneeUtils'

export const applicantSubmitAccessAgreementSection = buildSection({
  condition: (answers, externalData) =>
    shouldShowApplicantSubmitAccessAgreementSection(answers, externalData),
  id: 'applicantSubmitAccessAgreementSection',
  title: m.applicantSubmitMessages.applicantSubmitAccessAgreementSectionTitle,
  children: [
    buildMultiField({
      id: (_application, user) =>
        `${getNationalIdPrefix(user)}.applicantSubmitAccessAgreement`,
      title: m.applicantSubmitMessages.applicantSubmitAccessAgreementTitle,
      description: applicantSubmitAccessAgreementDescription,
      children: [
        buildFieldsRepeaterField({
          id: 'applicantSubmitAccessAgreementRepeater',
          marginTop: 0,
          width: 'full',
          minRows: applicantSubmitAccessAgreementRepeaterMinRows,
          maxRows: applicantSubmitAccessAgreementRepeaterMaxRows,
          formTitle: (index) => ({
            ...m.assigneeDraft.umgengnissamningurRepeaterFormTitle,
            values: { index: index + 1 },
          }),
          formTitleVariant: 'h3',
          formTitleNumbering: 'none',
          hideAddButton: true,
          fields: {
            childNationalId: {
              component: 'select',
              width: 'full',
              label: m.assigneeDraft.umgengnissamningurSelectChildTitle,
              options: (application) =>
                applicantSubmitAccessAgreementChildOptions(application),
              required: true,
              filterOptions: (options, formValues, index) => {
                const answersObj = formValues as FormValue
                const applicantRaw = getValueViaPath<string>(
                  answersObj,
                  'applicant.nationalId',
                )?.trim()
                if (!applicantRaw || !kennitala.isValid(applicantRaw)) {
                  return options
                }
                const kt = kennitala.sanitize(applicantRaw)
                const repeater = getValueViaPath<
                  Array<{ childNationalId?: string }>
                >(answersObj, `${kt}.applicantSubmitAccessAgreementRepeater`)

                if (!Array.isArray(repeater)) {
                  return options
                }
                const taken = new Set<string>()
                repeater.forEach((row, i) => {
                  if (i === index) {
                    return
                  }
                  const id = row?.childNationalId?.trim()
                  if (id && kennitala.isValid(id)) {
                    taken.add(kennitala.sanitize(id))
                  } else if (id) {
                    taken.add(id)
                  }
                })
                return options.filter((o) => {
                  const v = String(o.value)
                  const optKey = kennitala.isValid(v)
                    ? kennitala.sanitize(v)
                    : v
                  return !taken.has(optKey)
                })
              },
            },
            file: {
              component: 'fileUpload',
              width: 'full',
              title: m.assigneeDraft.umgengnissamningurFileTitle,
              uploadAccept: '.pdf,.doc,.docx',
            },
          },
        }),
      ],
    }),
  ],
})
