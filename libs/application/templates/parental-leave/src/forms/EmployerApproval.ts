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
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'

import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import {
  employerFormMessages,
  otherParentApprovalFormMessages,
} from '../lib/messages'
import {
  getApplicationAnswers,
  getLastDayOfLastMonth,
} from '../lib/parentalLeaveUtils'

export const EmployerApproval: Form = buildForm({
  id: 'EmployerApprovalForParentalLeave',
  title: employerFormMessages.formTitle,
  logo: DirectorateOfLabourLogo,
  mode: FormModes.IN_PROGRESS,
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
                  component: 'EmployerApprovalExtraInformation',
                }),
                buildDescriptionField({
                  id: 'final',
                  title: otherParentApprovalFormMessages.warning,
                  titleVariant: 'h4',
                  description:
                    otherParentApprovalFormMessages.startDateInThePast,
                  condition: (answers) => {
                    const lastDateOfLastMonth = getLastDayOfLastMonth()
                    const startDateTime = new Date(
                      getApplicationAnswers(answers).periods[0].startDate,
                    ).getTime()

                    return startDateTime < lastDateOfLastMonth.getTime()
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
                      event: DefaultEvents.REJECT,
                    },
                    {
                      name: coreMessages.buttonApprove,
                      type: 'primary',
                      event: DefaultEvents.APPROVE,

                      // TODO: enable this when we could get 'applicationFundId' from externalData

                      // condition: (answers) =>
                      //   new Date(
                      //     getApplicationAnswers(answers).periods[0].startDate,
                      //   ).getTime() >= currentDateStartTime(),
                    },
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
    }),
  ],
})
