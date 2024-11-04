import {
  buildAlertMessageField,
  buildExpandableDescriptionField,
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
  coreMessages,
  buildMessageWithLinkButtonField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import {
  information,
  externalData,
  sections,
  overview,
  conclusion,
} from '../lib/messages'
import { Logo } from '../assets/Logo'

export const Conclusion: Form = buildForm({
  id: 'ConclusionApplicationForm',
  title: '',
  logo: Logo,
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'announcement',
      title: externalData.dataProvider.announcement,
      children: [],
    }),
    buildSection({
      id: 'informationSection',
      title: information.general.pageTitle,
      children: [],
    }),
    buildSection({
      id: 'accidentSection',
      title: sections.draft.accident,
      children: [],
    }),
    buildSection({
      id: `employeeSection`,
      title: sections.draft.employee,
      children: [],
    }),
    buildSection({
      id: `causeAndConsequencesSection`,
      title: sections.draft.causes,
      children: [],
    }),
    buildSection({
      id: `overviewSection`,
      title: overview.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'conclusion',
      title: conclusion.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'uiForms.conclusionMultifield',
          title: conclusion.general.title,
          children: [
            buildAlertMessageField({
              id: 'uiForms.conclusionAlert',
              title: conclusion.default.alertTitle,
              alertType: 'success',
            }),
            buildExpandableDescriptionField({
              id: 'uiForms.conclusionExpandableDescription',
              title: conclusion.default.accordionTitle,
              introText: '',
              description: conclusion.default.accordionText,
              startExpanded: true,
            }),
            buildCustomField({
              id: 'pdfoverview',
              title: '',
              component: 'PdfOverview',
            }),
            buildMessageWithLinkButtonField({
              id: 'uiForms.conclusionBottomLink',
              title: '',
              url: '/minarsidur/umsoknir',
              buttonTitle: coreMessages.openServicePortalButtonTitle,
              message: coreMessages.openServicePortalMessageText,
              marginBottom: [4, 4, 12],
            }),
          ],
        }),
      ],
    }),
  ],
})
