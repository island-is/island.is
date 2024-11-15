import { defineMessages } from 'react-intl'

export const review = {
  general: defineMessages({
    sectionTitle: {
      id: 'uni.application:review.general.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Review section title',
    },
    pageTitle: {
      id: 'uni.application:review.general.pageTitle',
      defaultMessage: 'Yfirlit umsóknar',
      description: 'Review page title',
    },
    description: {
      id: 'uni.application:review.general.description',
      defaultMessage:
        'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplýsingar hafi verið gefnar upp',
      description: 'Review description',
    },
  }),
  labels: defineMessages({
    changeButtonText: {
      id: 'uni.application:review.labels.changeButtonText',
      defaultMessage: 'Breyta upplýsingum',
      description: 'change button label',
    },
    applicant: {
      id: 'uni.application:review.labels.applicant#markdown',
      defaultMessage: '**Umsækjandi**',
      description: 'Applicant review label',
    },
    chosenProgram: {
      id: 'uni.application:review.labels.chosenProgram#markdown',
      defaultMessage: '**Valið háskólanám til umsóknar**',
      description: 'Chosen program review label',
    },
    schoolCareer: {
      id: 'uni.application:review.labels.schoolCareer#markdown',
      defaultMessage: '**Námsferill**',
      description: 'School career review label',
    },
    documents: {
      id: 'uni.application:review.labels.documents#markdown',
      defaultMessage: '**Fylgigögn**',
      description: 'documents review label',
    },
    otherDocuments: {
      id: 'uni.application:review.labels.otherDocuments#markdown',
      defaultMessage: '**Önnur fylgigögn**',
      description: 'Other documents review label',
    },
    phoneLabel: {
      id: 'uni.application:review.labels.phoneLabel',
      defaultMessage: 'Sími',
      description: 'phone label',
    },
    exemptionInformation: {
      id: 'uni.application:review.labels.exemptionInformation',
      defaultMessage: 'Undanþáguupplýsingar',
      description: 'exemption information label',
    },
    thirdLevelInformation: {
      id: 'uni.application:review.labels.thirdLevelInformation',
      defaultMessage: 'Upplýsingar um nám á þriðja hæfnisstigi',
      description: 'third level education information label',
    },
    notFinishedInformation: {
      id: 'uni.application:review.labels.notFinishedInformation',
      defaultMessage: 'Upplýsingar um ólokið nám',
      description: 'not finished education information label',
    },
  }),
  buttons: defineMessages({
    back: {
      id: 'uni.application:review.buttons.back',
      defaultMessage: 'Til baka',
      description: 'Back button in review process',
    },
    reject: {
      id: 'uni.application:review.buttons.reject',
      defaultMessage: 'Hafna',
      description: 'Reject button in review process',
    },
    approve: {
      id: 'uni.application:review.buttons.approve',
      defaultMessage: `Samþykkja`,
      description: 'Approve button in review process',
    },
  }),
  confirmationModal: defineMessages({
    title: {
      id: 'uni.application:overview.confirmationModal.title',
      defaultMessage: 'Hafna tilkynningu',
      description: 'Confirmation modal reject title',
    },
    text: {
      id: 'uni.application:overview.confirmationModal.text',
      defaultMessage: 'Þú ert að fara að hafna tilkynningu.',
      description: 'Confirmation modal reject text',
    },
    buttonText: {
      id: 'uni.application:overview.confirmationModal.buttonText',
      defaultMessage: 'Hafna tilkynningu',
      description: 'Confirmation modal reject button',
    },
    cancelButton: {
      id: 'uni.application:overview.confirmationModal.cancelButton',
      defaultMessage: 'Hætta við',
      description: 'Confirmation modal cancel button',
    },
  }),
}
