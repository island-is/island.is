import {
  buildCustomField,
  buildDividerField,
  buildFileUploadField,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
  buildTextField,
  buildSelectField,
  buildAlertMessageField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  Comparators,
  FormValue,
} from '@island.is/application/types'

import {
  applicantInformationMultiField,
  buildFormConclusionSection,
} from '@island.is/application/ui-forms'
import * as m from '../lib/messages'

export const HomeSupportForm: Form = buildForm({
  id: 'HomeSupportDraft',
  title: m.application.general.name,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'applicantInfoSection',
      title: m.application.applicant.infoSectionTitle,
      children: [applicantInformationMultiField()],
      condition: (_, externalData) => {
        console.log('externalData', externalData)
        return true
      },
    }),
    buildSection({
      id: 'legalDomicilePersonsSection',
      title: m.application.applicant.legalDomicilePersonsSectionTitle,
      children: [
        buildDescriptionField({
          id: 'test',
          title: m.application.applicant.legalDomicilePersonsSectionSubtitle,
          description: ({ externalData }) => {
            const cohabitants = externalData.nationalRegistryCohabitants
              .data as any[] | null
            return (
              cohabitants
                ?.map((x) => `${x.fullName} (${x.nationalId})`)
                .join('\n\n') ?? ''
            )
          },
          space: 2,
        }),
      ],
    }),
    /* buildFormConclusionSection({
      alertTitle: m.successfulSubmissionTitle,
      alertMessage: m.successfulSubmissionMessage,
      expandableHeader: m.successfulExpendableHeader,
      expandableDescription: m.nextStepReviewTime,
    }), */
  ],
})
