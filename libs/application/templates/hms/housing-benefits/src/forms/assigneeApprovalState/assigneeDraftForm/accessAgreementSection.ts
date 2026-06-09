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
import * as m from '../../../lib/messages'
import {
  assigneeAccessAgreementChildOptions,
  assigneeAccessAgreementRepeaterMaxRows,
  assigneeAccessAgreementRepeaterMinRows,
  buildAssigneeAccessAgreementRepeaterDefaultRows,
  findAssigneeAccessAgreementRepeater,
} from '../../../utils/assigneeAccessAgreementUtils'
import {
  getAssigneeNationalIdForUmgengnissamningurForm,
  nationalIdPreface,
  shouldShowAssigneeUmgengnissamningurScreen,
} from '../../../utils/assigneeUtils'
import { doesAssigneeAddressMatchRentalContract } from '../../../utils/rentalAgreementUtils'
import {
  formatIcelandicNameList,
  getNonCustodyMinorsMissingCustodyAgreementNames,
  shouldShowNonCustodyMinorMissingCustodyAgreementAlert,
} from '../../../utils/utils'

export const accessAgreementSection = buildSection({
  condition: (answers, externalData, user) =>
    doesAssigneeAddressMatchRentalContract(answers, externalData, user) &&
    shouldShowAssigneeUmgengnissamningurScreen(answers, externalData, user),
  id: 'assigneeAccessAgreementSection',
  title: m.draftMessages.accessAgreementSection.title,
  children: [
    buildMultiField({
      id: (application, user) =>
        nationalIdPreface(application, user, 'assigneeAccessAgreement'),
      title: m.draftMessages.accessAgreementSection.multiFieldTitle,
      children: [
        buildAlertMessageField({
          id: (application, user) =>
            nationalIdPreface(
              application,
              user,
              'assigneeHouseholdMembersNonCustodyMinorAgreementAlert',
            ),
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
          id: (application, user) =>
            nationalIdPreface(
              application,
              user,
              'assigneeAccessAgreementDescription',
            ),
          description:
            m.draftMessages.accessAgreementSection
              .repeaterIntroDescriptionWithChildren,
          marginBottom: 4,
        }),
        buildFieldsRepeaterField({
          id: (application, user) =>
            nationalIdPreface(
              application,
              user,
              'assigneeAccessAgreementRepeater',
            ),
          marginTop: 2,
          width: 'full',
          minRows: (answers, externalData) =>
            assigneeAccessAgreementRepeaterMinRows(answers, externalData),
          maxRows: (answers, externalData) =>
            assigneeAccessAgreementRepeaterMaxRows(answers, externalData),
          defaultValue: (application: Application) =>
            buildAssigneeAccessAgreementRepeaterDefaultRows(application),
          formTitle: (index) => ({
            ...m.assigneeDraft.umgengnissamningurRepeaterFormTitle,
            values: { index: index + 1 },
          }),
          formTitleVariant: 'h3',
          formTitleNumbering: 'none',
          addItemButtonText: m.assigneeDraft.umgengnissamningurRepeaterAddItem,
          hideAddButton: (application) => {
            const assigneeId =
              getAssigneeNationalIdForUmgengnissamningurForm(application)
            if (!assigneeId) {
              return false
            }
            const maxRows = assigneeAccessAgreementRepeaterMaxRows(
              application.answers,
              application.externalData,
            )
            const kt = kennitala.sanitize(assigneeId)
            const rows = getValueViaPath<unknown[]>(
              application.answers,
              `${kt}.assigneeAccessAgreementRepeater`,
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
                assigneeAccessAgreementChildOptions(application, activeValues),
              required: (_application, activeValues) => {
                const files = activeValues?.file as
                  | Array<{ key: string; name: string }>
                  | undefined
                return Array.isArray(files) && files.length > 0
              },
              filterOptions: (options, formValues, index) => {
                const repeater = findAssigneeAccessAgreementRepeater(
                  formValues as FormValue,
                )
                if (!repeater) {
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
              uploadAccept: '.pdf,.doc,.docx',
            },
          },
        }),
      ],
    }),
  ],
})
