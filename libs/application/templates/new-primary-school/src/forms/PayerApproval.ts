import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'
import { Application, DefaultEvents, Form } from '@island.is/application/types'
import {
  newPrimarySchoolMessages,
  payerApprovalMessages,
} from '../lib/messages'
import {
  getApplicationAnswers,
  getSchoolName,
} from '../utils/newPrimarySchoolUtils'

export const PayerApproval: Form = buildForm({
  id: 'newPrimarySchoolPayerApproval',
  children: [
    buildSection({
      id: 'payerApproval',
      tabTitle: payerApprovalMessages.tabTitle,
      children: [
        buildMultiField({
          id: 'payerApproval',
          title: payerApprovalMessages.title,
          description: payerApprovalMessages.description,
          children: [
            buildTextField({
              id: 'payerApproval.name',
              title: payerApprovalMessages.childName,
              width: 'full',
              disabled: true,
              defaultValue: (application: Application) => {
                const { childInfo } = getApplicationAnswers(application.answers)
                return childInfo?.name
              },
            }),
            buildTextField({
              id: 'payerApproval.nationalId',
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
              id: 'payerApproval.selectedSchool',
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
                  name: payerApprovalMessages.reject,
                  type: 'reject',
                },
                {
                  event: DefaultEvents.APPROVE,
                  name: payerApprovalMessages.confirm,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'payerApproval.thanks',
          title: payerApprovalMessages.title,
          description: payerApprovalMessages.thanksDescription,
        }),
      ],
    }),
  ],
})
