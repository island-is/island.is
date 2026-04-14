import {
  buildAlertMessageField,
  buildDescriptionField,
  buildForm,
  buildImageField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Application, FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { applicantSubmitMessages as m } from '../../../lib/messages/applicantSubmitMessages'
import { HikingAndWateringPlants } from '@island.is/application/assets/graphics'

export const ApplicantSubmitFormAssigneeVersion = buildForm({
  id: 'ApplicantSubmitAssignee',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  logo: HmsLogo,
  children: [
    buildSection({
      id: 'applicantSubmitAssigneeSection',
      tabTitle: m.assigneeFormTitle,
      children: [
        buildMultiField({
          id: 'applicantSubmitAssigneeMultiField',
          title: m.assigneeFormTitle,
          children: [
            buildAlertMessageField({
              id: 'applicantSubmitAssigneeNextSteps',
              title: m.assigneeConsentAlertTitle,
              message: m.assigneeConsentAlertMessage,
              alertType: 'success',
              marginBottom: 4,
            }),
            buildDescriptionField({
              id: 'applicantSubmitAssigneeNextSteps2',
              description: (application: Application) => {
                const applicantName =
                  getValueViaPath<string>(
                    application.answers,
                    'applicant.name',
                  ) ??
                  getValueViaPath<string>(
                    application.externalData,
                    'nationalRegistry.data.fullName',
                  ) ??
                  ''
                return {
                  ...m.assigneeNextStepsDescription,
                  values: { applicantName },
                }
              },
              marginBottom: 8,
            }),
            buildImageField({
              id: 'applicantSubmitAssigneeNextSteps3',
              image: HikingAndWateringPlants,
              marginBottom: 4,
            }),
          ],
        }),
      ],
    }),
  ],
})
