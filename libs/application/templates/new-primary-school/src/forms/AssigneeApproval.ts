import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { Application, DefaultEvents, Form } from '@island.is/application/types'
import { newPrimarySchoolMessages, assigneeMessages } from '../lib/messages'
import { States } from '../utils/constants'
import {
  getApplicationAnswers,
  getSchoolName,
} from '../utils/newPrimarySchoolUtils'

export const AssigneeApproval: Form = buildForm({
  id: 'newPrimarySchoolAssigneeApproval',
  children: [
    buildSection({
      id: 'assigneeApproval',
      tabTitle: (application) => {
        return application.state === States.OTHER_GUARDIAN_APPROVAL
          ? assigneeMessages.otherGuardian.title
          : assigneeMessages.payer.title
      },
      children: [
        buildMultiField({
          id: 'assigneeApproval',
          title: (application) => {
            return application.state === States.OTHER_GUARDIAN_APPROVAL
              ? assigneeMessages.otherGuardian.title
              : assigneeMessages.payer.title
          },
          description: (application) => {
            return application.state === States.OTHER_GUARDIAN_APPROVAL
              ? assigneeMessages.otherGuardian.approvalDescription
              : assigneeMessages.payer.approvalDescription
          },
          children: [
            buildTextField({
              id: 'assigneeApproval.name',
              title: assigneeMessages.shared.childName,
              width: 'full',
              disabled: true,
              defaultValue: (application: Application) => {
                const { childInfo } = getApplicationAnswers(application.answers)
                return childInfo?.name
              },
            }),
            buildTextField({
              id: 'assigneeApproval.nationalId',
              title: newPrimarySchoolMessages.shared.nationalId,
              width: 'full',
              format: '######-####',
              disabled: true,
              defaultValue: (application: Application) => {
                const { childInfo } = getApplicationAnswers(application.answers)
                return childInfo?.nationalId
              },
            }),
            buildTextField({
              id: 'assigneeApproval.selectedSchool',
              title: newPrimarySchoolMessages.overview.selectedSchool,
              width: 'full',
              disabled: true,
              defaultValue: (application: Application) => {
                const { selectedSchoolId } = getApplicationAnswers(
                  application.answers,
                )

                return getSchoolName(
                  application.externalData,
                  selectedSchoolId ?? '',
                )
              },
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              actions: [
                {
                  event: DefaultEvents.REJECT,
                  name: assigneeMessages.shared.reject,
                  type: 'reject',
                },
                {
                  event: DefaultEvents.APPROVE,
                  name: assigneeMessages.shared.approve,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'assigneeApproval.thanks',
          title: (application) => {
            return application.state === States.OTHER_GUARDIAN_APPROVAL
              ? assigneeMessages.otherGuardian.title
              : assigneeMessages.payer.title
          },
          description: assigneeMessages.shared.thanksDescription,
        }),
      ],
    }),
  ],
})
