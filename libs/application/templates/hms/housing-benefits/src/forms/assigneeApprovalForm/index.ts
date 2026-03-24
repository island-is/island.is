import {
  buildForm,
  buildSection,
  buildMultiField,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildDescriptionField,
  buildCheckboxField,
  buildHiddenInput,
  buildSubmitField,
  YES,
} from '@island.is/application/core'
import { Application, DefaultEvents, FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { getValueViaPath } from '@island.is/application/core'
import * as kennitala from 'kennitala'
import { NationalRegistryApi } from '../../dataProviders'
import * as m from '../../lib/messages'

export const AssigneeApproval = buildForm({
  id: 'AssigneeApproval',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  logo: HmsLogo,
  children: [
    buildSection({
      id: 'assigneeApprovalSection',
      title: m.assigneeApproval.title,
      children: [
        buildExternalDataProvider({
          id: 'assigneeApprovalExternalData',
          title: m.assigneeApproval.title,
          subTitle: m.assigneeApproval.externalDataSubTitle,
          checkboxLabel: m.assigneeApproval.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryApi,
              title: m.assigneeApproval.nationalRegistryTitle,
              subTitle: m.assigneeApproval.nationalRegistrySubTitle,
            }),
          ],
        }),
        buildMultiField({
          id: 'assigneeApprovalMultiField',
          title: m.assigneeApproval.title,
          description: m.assigneeApproval.description,
          children: [
            buildDescriptionField({
              id: 'assigneeApprovalDescription',
              description: m.assigneeApproval.description,
              marginBottom: 4,
            }),
            buildCheckboxField({
              id: 'assigneeApproval.confirmRead',
              options: [
                {
                  label: m.assigneeApproval.confirmRead,
                  value: YES,
                },
              ],
              marginBottom: 4,
              required: true,
            }),
            buildHiddenInput({
              id: 'householdMemberApprovals',
              defaultValue: (application: Application) => {
                const signed = (getValueViaPath<string[]>(
                  application.answers,
                  'householdMemberApprovals',
                ) ?? []) as string[]
                const userNationalId = getValueViaPath<string>(
                  application.externalData,
                  'nationalRegistry.data.nationalId',
                )
                const assignees = application.assignees ?? []
                const normalizedUser = userNationalId?.trim()
                  ? kennitala.isValid(userNationalId)
                    ? kennitala.sanitize(userNationalId)
                    : userNationalId
                  : ''
                const isAssignee =
                  normalizedUser && assignees.includes(normalizedUser)
                const alreadySigned = signed.some(
                  (id) =>
                    (kennitala.isValid(id) ? kennitala.sanitize(id) : id) ===
                    normalizedUser,
                )
                if (isAssignee && !alreadySigned) {
                  return [...signed, normalizedUser]
                }
                return signed
              },
            }),
            buildSubmitField({
              id: 'assigneeApprovalSubmit',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.APPROVE,
                  name: m.assigneeApproval.approveButton,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
