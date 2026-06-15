import {
  buildAlertMessageField,
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { FormValue, Application } from '@island.is/application/types'
import * as kennitala from 'kennitala'
import * as m from '../../lib/messages'
import { UPLOAD_ACCEPT } from '../../utils/constants'
import {
  buildMainFormAccessAgreementRepeaterDefaultRows,
  mainFormAccessAgreementChildOptions,
  mainFormAccessAgreementRepeaterMaxRows,
  mainFormAccessAgreementRepeaterMinRows,
} from '../../utils/mainFormAccessAgreementUtils'
import {
  formatIcelandicNameList,
  getNonCustodyMinorsMissingCustodyAgreementNames,
  hasNonCustodyMinorsInHousehold,
  shouldShowNonCustodyMinorMissingCustodyAgreementAlert,
} from '../../utils/utils'

export const accessAgreementSection = buildSection({
  id: 'accessAgreementSection',
  title: m.draftMessages.accessAgreementSection.title,
  condition: (answers, externalData) =>
    !!getValueViaPath<string>(answers, 'rentalAgreement.answer') &&
    hasNonCustodyMinorsInHousehold(answers, externalData),
  children: [
    buildMultiField({
      id: 'accessAgreementMultiField',
      title: m.draftMessages.accessAgreementSection.multiFieldTitle,
      children: [
        buildAlertMessageField({
          id: 'householdMembersNonCustodyMinorAgreementAlert',
          title:
            m.draftMessages.householdMembersSection
              .nonCustodyMinorMissingAgreementAlertTitle,
          message: (application) => ({
            ...m.draftMessages.householdMembersSection
              .nonCustodyMinorMissingAgreementAlertMessage,
            values: {
              names: formatIcelandicNameList(
                getNonCustodyMinorsMissingCustodyAgreementNames(
                  application.answers,
                  application.externalData,
                ),
              ),
            },
          }),
          alertType: 'info',
          condition: (answers, externalData) =>
            shouldShowNonCustodyMinorMissingCustodyAgreementAlert(
              answers,
              externalData,
            ),
        }),
        buildDescriptionField({
          id: 'accessAgreementDescription',
          description:
            m.draftMessages.accessAgreementSection
              .repeaterIntroDescriptionWithChildren,
          marginBottom: 4,
        }),
        buildFieldsRepeaterField({
          id: 'mainFormAccessAgreementRepeater',
          marginTop: 2,
          width: 'full',
          minRows: (answers, externalData) =>
            mainFormAccessAgreementRepeaterMinRows(answers, externalData),
          maxRows: (answers, externalData) =>
            mainFormAccessAgreementRepeaterMaxRows(answers, externalData),
          defaultValue: (application: Application) =>
            buildMainFormAccessAgreementRepeaterDefaultRows(
              application.answers,
              application.externalData,
            ),
          formTitle: (index) => ({
            ...m.assigneeDraft.umgengnissamningurRepeaterFormTitle,
            values: { index: index + 1 },
          }),
          formTitleVariant: 'h3',
          formTitleNumbering: 'none',
          addItemButtonText: m.assigneeDraft.umgengnissamningurRepeaterAddItem,
          hideAddButton: (application) => {
            const maxRows = mainFormAccessAgreementRepeaterMaxRows(
              application.answers,
              application.externalData,
            )
            const rows = getValueViaPath<unknown[]>(
              application.answers,
              'mainFormAccessAgreementRepeater',
            )
            const n = Array.isArray(rows) ? rows.length : 0
            return n >= maxRows
          },
          fields: {
            childNationalId: {
              component: 'select',
              width: 'full',
              label: m.assigneeDraft.umgengnissamningurSelectChildTitle,
              options: (application, activeValues) =>
                mainFormAccessAgreementChildOptions(application, activeValues),
              required: (_application, activeValues) => {
                const files = activeValues?.file as
                  | Array<{ key: string; name: string }>
                  | undefined
                return Array.isArray(files) && files.length > 0
              },
              filterOptions: (options, formValues, index) => {
                const answersObj = formValues as FormValue
                const repeater = getValueViaPath<
                  Array<{ childNationalId?: string }>
                >(answersObj, 'mainFormAccessAgreementRepeater')

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
                const curId = repeater[index]?.childNationalId?.trim()
                const curKey =
                  curId && kennitala.isValid(curId)
                    ? kennitala.sanitize(curId)
                    : curId ?? ''
                return options.filter((o) => {
                  const v = String(o.value)
                  const optKey = kennitala.isValid(v)
                    ? kennitala.sanitize(v)
                    : v
                  if (curKey && optKey === curKey) {
                    return true
                  }
                  return !taken.has(optKey)
                })
              },
            },
            file: {
              component: 'fileUpload',
              width: 'full',
              title: m.assigneeDraft.umgengnissamningurFileTitle,
              uploadAccept: UPLOAD_ACCEPT,
            },
          },
        }),
      ],
    }),
  ],
})
