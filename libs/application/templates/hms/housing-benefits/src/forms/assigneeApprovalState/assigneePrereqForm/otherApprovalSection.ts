import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  YES,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { nationalIdPreface } from '../../../utils/assigneeUtils'

export const otherApprovalSection = buildSection({
  id: 'assigneePrereqSection',
  title: m.assigneeApproval.prereqSectionTitle,
  children: [
    buildMultiField({
      id: 'assigneePrereqMultiField',
      title: m.assigneeApproval.prereqSectionTitle,
      description: m.assigneeApproval.prereqDescription,
      children: [
        buildDescriptionField({
          id: 'assigneePrereqIntro',
          description: m.assigneeApproval.prereqDescription,
          marginBottom: 4,
        }),
        buildCheckboxField({
          id: (application, user) =>
            nationalIdPreface(application, user, 'confirmRead'),
          options: [
            {
              label: m.assigneeApproval.prereqConfirmRead,
              value: YES,
            },
          ],
          marginBottom: 4,
          required: true,
        }),
        // buildHiddenInput({
        //   id: 'assigneePrerequisitesCompleted',
        //   defaultValue: (application: Application) => {
        //     const existing = (getValueViaPath<string[]>(
        //       application.answers,
        //       'assigneePrerequisitesCompleted',
        //     ) ?? []) as string[]
        //     const confirm = getValueViaPath<string[]>(
        //       application.answers,
        //       assigneePrereqConfirmReadPath(application),
        //     )
        //     const nrOk =
        //       application.externalData?.nationalRegistry?.status === 'success'
        //     const taxOk =
        //       application.externalData?.getPersonalTaxReturn?.status ===
        //       'success'
        //     const userNationalId = getValueViaPath<string>(
        //       application.externalData,
        //       'nationalRegistry.data.nationalId',
        //     )
        //     const normalizedUser = userNationalId?.trim()
        //       ? kennitala.isValid(userNationalId)
        //         ? kennitala.sanitize(userNationalId)
        //         : userNationalId
        //       : ''
        //     const assignees = application.assignees ?? []
        //     const isAssignee =
        //       normalizedUser && assignees.includes(normalizedUser)
        //     const hasConfirm = Array.isArray(confirm) && confirm.includes(YES)
        //     if (!nrOk || !taxOk || !isAssignee || !hasConfirm) {
        //       return existing
        //     }
        //     const already = existing.some(
        //       (id) =>
        //         (kennitala.isValid(id) ? kennitala.sanitize(id) : id) ===
        //         normalizedUser,
        //     )
        //     if (already) return existing
        //     return [...existing, normalizedUser]
        //   },
        // }),
      ],
    }),
  ],
})
