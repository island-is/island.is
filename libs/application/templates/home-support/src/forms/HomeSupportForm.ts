import {
  buildCustomField,
  buildDividerField,
  buildFileUploadField,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildActionCardListField,
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
  NationalRegistryIndividual,
} from '@island.is/application/types'

import {
  applicantInformationMultiField,
  buildFormConclusionSection,
} from '@island.is/application/ui-forms'
import * as m from '../lib/messages'
import { mapIndividualToActionCard } from '../utils'

export const HomeSupportForm: Form = buildForm({
  id: 'HomeSupportDraft',
  title: m.application.general.name,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'applicantInfoSection',
      title: m.application.applicant.infoSectionTitle,
      children: [applicantInformationMultiField()],
    }),
    buildSection({
      id: 'legalDomicilePersonsSection',
      title: m.application.applicant.legalDomicilePersonsSectionTitle,
      children: [
        buildActionCardListField({
          id: 'ActionCardListTest',
          title: m.application.applicant.legalDomicilePersonsSectionSubtitle,
          items: (application) => {
            const cohabitants = application.externalData
              .nationalRegistryCohabitants.data as NationalRegistryIndividual[]

            return cohabitants.map((x) => mapIndividualToActionCard(x))
          },
        }),
      ],
    }),
    buildSection({
      id: 'blabala',
      title: 'Tengiliðir',
      children: [
        buildDescriptionField({
          id: 'hallooo',
          title: 'Blabla',
          description: 'Hellooo',
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
