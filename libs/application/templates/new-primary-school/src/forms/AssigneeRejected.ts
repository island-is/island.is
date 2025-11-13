import {
  buildAlertMessageField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { Application, DefaultEvents, Form } from '@island.is/application/types'
import { assigneeMessages, newPrimarySchoolMessages } from '../lib/messages'
import { States } from '../utils/constants'
import {
  getApplicationAnswers,
  getSchoolName,
  getOtherGuardian,
} from '../utils/newPrimarySchoolUtils'

export const AssigneeRejected: Form = buildForm({
  id: 'newPrimarySchoolAssigneeRejected',
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'assigneeRejected',
      tabTitle: (application) => {
        return application.state === States.OTHER_GUARDIAN_REJECTED
          ? assigneeMessages.otherGuardian.title
          : assigneeMessages.payer.title
      },
      children: [
        buildMultiField({
          id: 'assigneeRejected',
          title: (application) => {
            return application.state === States.OTHER_GUARDIAN_REJECTED
              ? assigneeMessages.otherGuardian.title
              : assigneeMessages.payer.title
          },
          description: (application) => {
            return application.state === States.OTHER_GUARDIAN_REJECTED
              ? assigneeMessages.otherGuardian.rejectedDescription
              : assigneeMessages.payer.rejectedDescription
          },
          children: [
            buildTextField({
              id: 'assigneeRejected.name',
              title: (application) => {
                return application.state === States.OTHER_GUARDIAN_REJECTED
                  ? assigneeMessages.otherGuardian.name
                  : assigneeMessages.payer.name
              },
              width: 'full',
              disabled: true,
              defaultValue: (application: Application) => {
                const { payerName } = getApplicationAnswers(application.answers)
                return application.state === States.OTHER_GUARDIAN_REJECTED
                  ? getOtherGuardian(
                      application.answers,
                      application.externalData,
                    )?.fullName
                  : payerName
              },
            }),
            buildTextField({
              id: 'assigneeRejected.nationalId',
              title: newPrimarySchoolMessages.shared.nationalId,
              width: 'full',
              format: '######-####',
              disabled: true,
              defaultValue: (application: Application) => {
                const { payerNationalId } = getApplicationAnswers(
                  application.answers,
                )
                return application.state === States.OTHER_GUARDIAN_REJECTED
                  ? getOtherGuardian(
                      application.answers,
                      application.externalData,
                    )?.nationalId
                  : payerNationalId
              },
            }),
            buildTextField({
              id: 'assigneeRejected.selectedSchool',
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
            buildAlertMessageField({
              id: 'assigneeRejected.alertMessage',
              title: newPrimarySchoolMessages.shared.alertTitle,
              message: (application) => {
                return application.state === States.OTHER_GUARDIAN_REJECTED
                  ? assigneeMessages.otherGuardian.alertMessage
                  : assigneeMessages.payer.alertMessage
              },
              doesNotRequireAnswer: true,
              alertType: 'info',
              marginTop: 4,
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.EDIT,
                  name: assigneeMessages.shared.editApplication,
                  type: 'sign',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
