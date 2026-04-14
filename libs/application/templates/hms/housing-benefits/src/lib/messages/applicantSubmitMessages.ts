import { defineMessages } from 'react-intl'

export const applicantSubmitMessages = defineMessages({
  // --- Assignee-facing messages (unchanged) ---
  assigneeFormTitle: {
    id: 'hb.application:applicantSubmit.assigneeFormTitle',
    defaultMessage: 'Umsókn bíður staðfestingar umsækjanda',
    description:
      'Title for assignee view while application awaits final applicant submit',
  },
  assigneeAlertTitle: {
    id: 'hb.application:applicantSubmit.assigneeAlertTitle',
    defaultMessage: 'Næstu skref',
    description: 'Alert title on assignee applicant-submit waiting screen',
  },
  assigneeAlertMessage: {
    id: 'hb.application:applicantSubmit.assigneeAlertMessage#markdown',
    defaultMessage:
      'Þú hefur lokið við þína hluta umsóknarinnar. **Umsækjandi** þarf nú að skrá sig inn á Ísland.is, opna umsóknina og **senda hana inn til HMS** til meðferðar.\n\nÞú getur ekki sent umsóknina inn fyrir hans hönd.',
    description:
      'Assignee info: applicant must log in and submit the application',
  },
  assigneeConsentAlertTitle: {
    id: 'hb.application:applicantSubmit.assigneeConsentAlertTitle',
    defaultMessage: 'Heimilismenn hafa veitt samþykki fyrir gagnaöflun',
    description:
      'Alert title confirming all household members have given consent',
  },
  assigneeConsentAlertMessage: {
    id: 'hb.application:applicantSubmit.assigneeConsentAlertMessage',
    defaultMessage:
      'Allir heimilismenn listaðir á umsókninni hafa veitt samþykki fyrir gagnaöflun.',
    description:
      'Alert message confirming all household members have given consent',
  },
  assigneeNextStepsDescription: {
    id: 'hb.application:applicantSubmit.assigneeNextStepsDescription',
    defaultMessage:
      'Umsækjandi, {applicantName}, þarf nú að skrá sig inn á Ísland.is, opna og yfirfara umsóknina áður en hún fer inn til vinnslu hjá HMS.',
    description:
      'Description telling assignee that the applicant must review and submit',
  },

  // --- Applicant-facing messages ---
  infoSectionTitle: {
    id: 'hb.application:applicantSubmit.infoSectionTitle',
    defaultMessage: 'Staðfesting',
    description: 'Info screen section tab title',
  },
  infoTitle: {
    id: 'hb.application:applicantSubmit.infoTitle',
    defaultMessage: 'Umsókn tilbúin til innsendingar',
    description: 'Info screen title',
  },
  infoAlertTitle: {
    id: 'hb.application:applicantSubmit.infoAlertTitle',
    defaultMessage: 'Allir aðilar hafa samþykkt',
    description: 'Info screen alert title',
  },
  infoAlertMessage: {
    id: 'hb.application:applicantSubmit.infoAlertMessage',
    defaultMessage:
      'Allir heimilismenn hafa veitt samþykki sitt og lokið sínum hluta umsóknarinnar.',
    description: 'Info screen alert message',
  },
  infoDescription: {
    id: 'hb.application:applicantSubmit.infoDescription',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar á næstu skjám og sendu umsóknina inn til HMS til meðferðar.',
    description: 'Info screen description',
  },
  applicantOverviewSectionTitle: {
    id: 'hb.application:applicantSubmit.applicantOverviewSectionTitle',
    defaultMessage: 'Upplýsingar umsækjanda',
    description: 'Applicant overview section tab title',
  },
  applicantOverviewTitle: {
    id: 'hb.application:applicantSubmit.applicantOverviewTitle',
    defaultMessage: 'Yfirlit umsækjanda',
    description: 'Applicant overview screen title',
  },
  applicantOverviewDescription: {
    id: 'hb.application:applicantSubmit.applicantOverviewDescription',
    defaultMessage:
      'Hér má sjá yfirlit yfir þær upplýsingar sem þú fylltir út.',
    description: 'Applicant overview screen description',
  },
  assigneeOverviewSectionTitle: {
    id: 'hb.application:applicantSubmit.assigneeOverviewSectionTitle',
    defaultMessage: 'Upplýsingar heimilismanna',
    description: 'Assignee overview section tab title',
  },
  assigneeOverviewTitle: {
    id: 'hb.application:applicantSubmit.assigneeOverviewTitle',
    defaultMessage: 'Yfirlit heimilismanna',
    description: 'Assignee overview screen title',
  },
  assigneeOverviewDescription: {
    id: 'hb.application:applicantSubmit.assigneeOverviewDescription',
    defaultMessage:
      'Hér má sjá yfirlit yfir upplýsingar frá heimilismönnum sem samþykktu umsóknina.',
    description: 'Assignee overview screen description',
  },
  submitButton: {
    id: 'hb.application:applicantSubmit.submitButton',
    defaultMessage: 'Senda inn umsókn',
    description: 'Final submit button',
  },
})
