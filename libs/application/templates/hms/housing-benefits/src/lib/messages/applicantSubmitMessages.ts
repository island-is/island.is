import { defineMessages } from 'react-intl'

export const applicantSubmitMessages = defineMessages({
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
})
