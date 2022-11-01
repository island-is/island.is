import {
  buildCustomField,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  coreMessages,
  buildTextField,
  buildSubSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

import Logo from '../assets/Logo'
import {
  employerFormMessages,
  otherParentApprovalFormMessages,
} from '../lib/messages'
import { currentDateStartTime } from '../lib/parentalLeaveTemplateUtils'
import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '../lib/parentalLeaveUtils'

export const EmployerApproveEdits: Form = buildForm({
  id: 'EmployerApprovEditsParentalLeave',
  title: employerFormMessages.formTitle,
  logo: Logo,
  mode: FormModes.REVIEW,
  children: [
    buildSection({
      id: 'review',
      title: employerFormMessages.reviewSection,
      children: [
        buildSubSection({
          id: 'review.companyNationalRegistryId',
          title: employerFormMessages.employerNationalRegistryIdSection,
          children: [
            buildTextField({
              id: 'employerNationalRegistryId',
              title: employerFormMessages.employerNationalRegistryId,
              description: (application) => ({
                ...employerFormMessages.employerNationalRegistryIdDescription,
                values: { nationalId: application.applicant },
              }),
              format: '######-####',
              placeholder: '000000-0000',
            }),
          ],
        }),
        buildSubSection({
          id: 'review.confirmation',
          title: employerFormMessages.confirmationSubSection,
          children: [
            buildMultiField({
              id: 'multi',
              title: employerFormMessages.reviewMultiTitle,
              children: [
                buildCustomField(
                  {
                    id: 'timeline',
                    title: employerFormMessages.reviewMultiTitle,
                    component: 'PeriodsRepeater',
                  },
                  {
                    editable: false,
                    showDescription: false,
                  },
                ),
                buildCustomField({
                  id: 'unionAndPensionInfo',
                  title: '',
                  component: 'EmployerApprovalExtraInformation',
                }),
                buildDescriptionField({
                  id: 'final',
                  title: otherParentApprovalFormMessages.warning,
                  titleVariant: 'h4',
                  description:
                    otherParentApprovalFormMessages.startDateInThePast,
                  condition: (answers, externalData) => {
                    const { applicationFundId } = getApplicationExternalData(
                      externalData,
                    )
                    if (!applicationFundId || applicationFundId === '') {
                      const { periods } = getApplicationAnswers(answers)
                      return (
                        periods.length > 0 &&
                        new Date(periods[0].startDate).getTime() >=
                          currentDateStartTime()
                      )
                    }

                    return true
                  },
                }),
                buildSubmitField({
                  id: 'submit',
                  title: coreMessages.buttonSubmit,
                  placement: 'footer',
                  actions: [
                    {
                      name: employerFormMessages.buttonReject,
                      type: 'subtle',
                      event: 'REJECT',
                    },
                    {
                      name: coreMessages.buttonApprove,
                      type: 'primary',
                      event: 'APPROVE',
                      condition: (answers, externalData) => {
                        const {
                          applicationFundId,
                        } = getApplicationExternalData(externalData)
                        if (!applicationFundId || applicationFundId === '') {
                          const { periods } = getApplicationAnswers(answers)
                          return (
                            periods.length > 0 &&
                            new Date(periods[0].startDate).getTime() >=
                              currentDateStartTime()
                          )
                        }

                        return true
                      },
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final.approve',
          title: coreMessages.thanks,
          description: coreMessages.thanksDescription,
        }),
      ],
    }),
  ],
})
