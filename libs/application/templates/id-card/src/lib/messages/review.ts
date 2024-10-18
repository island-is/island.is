import { defineMessages } from 'react-intl'

export const review = {
  general: defineMessages({
    sectionTitle: {
      id: 'id.application:review.general.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Review section title',
    },
    pageTitle: {
      id: 'id.application:review.general.pageTitle',
      defaultMessage: 'Yfirlit umsóknar um nafnskírteini',
      description: 'Review page title',
    },
    description: {
      id: 'id.application:review.general.description',
      defaultMessage:
        'Vinsamlegast lestu yfir umsóknina til að vera viss um að réttar upplýsingar hafi verið gefnar. ',
      description: 'Review description',
    },
  }),
  labels: defineMessages({
    applicantDescription: {
      id: 'id.application:review.labels.applicantDescription',
      defaultMessage: 'Umsækjandi',
      description: 'Application description label',
    },
    applicantName: {
      id: 'id.application:review.labels.applicantName',
      defaultMessage: 'Nafn umsækjanda',
      description: 'Applicant name label',
    },
    licenseType: {
      id: 'id.application:review.labels.licenseType',
      defaultMessage: 'Tegund skírteinis',
      description: 'License type label',
    },
    applicantEmail: {
      id: 'id.application:review.labels.applicantEmail',
      defaultMessage: 'Netfang umsækjanda',
      description: 'Applicant email label',
    },
    applicantNumber: {
      id: 'id.application:review.labels.applicantNumber',
      defaultMessage: 'Símanúmer umsækjanda',
      description: 'Applicant phone number label',
    },
    parentDescription: {
      id: 'id.application:review.labels.parentDescription',
      defaultMessage: 'Forsjáraðilar',
      description: 'Parent description label',
    },
    parentAName: {
      id: 'id.application:review.labels.parentAName',
      defaultMessage: 'Nafn forsjáraðila 1',
      description: 'Parent A name label',
    },
    parentANationalId: {
      id: 'id.application:review.labels.parentANationalId',
      defaultMessage: 'Kennitala forsjáraðila 1',
      description: 'Parent A type label',
    },
    parentAEmail: {
      id: 'id.application:review.labels.parentAEmail',
      defaultMessage: 'Netfang forsjáraðila 1',
      description: 'Parent A email label',
    },
    parentANumber: {
      id: 'id.application:review.labels.parentANumber',
      defaultMessage: 'Símanúmer forsjáraðila 1',
      description: 'Parent A phone number label',
    },
    parentBName: {
      id: 'id.application:review.labels.parentBName',
      defaultMessage: 'Nafn forsjáraðila 2',
      description: 'Parent B name label',
    },
    parentBNationalId: {
      id: 'id.application:review.labels.parentBNationalId',
      defaultMessage: 'Kennitala forsjáraðila 2',
      description: 'Parent B type label',
    },
    parentBEmail: {
      id: 'id.application:review.labels.parentBEmail',
      defaultMessage: 'Netfang forsjáraðila 2',
      description: 'Parent B email label',
    },
    parentBNumber: {
      id: 'id.application:review.labels.parentBNumber',
      defaultMessage: 'Símanúmer forsjáraðila 2',
      description: 'Parent B phone number label',
    },
    deliveryDescription: {
      id: 'id.application:review.labels.deliveryDescription',
      defaultMessage: 'Afhending',
      description: 'Delivery description label',
    },
    deliveryOption: {
      id: 'id.application:review.labels.deliveryOption',
      defaultMessage: 'Afgreiðslumáti',
      description: 'Delivery option label',
    },
    deliveryLocation: {
      id: 'id.application:review.labels.deliveryLocation',
      defaultMessage: 'Afhendingastaður',
      description: 'Delivery location label',
    },
  }),
  buttons: defineMessages({
    back: {
      id: 'id.application:review.buttons.back',
      defaultMessage: 'Til baka',
      description: 'Back button in review process',
    },
    reject: {
      id: 'id.application:review.buttons.reject',
      defaultMessage: 'Hafna',
      description: 'Reject button in review process',
    },
    approve: {
      id: 'id.application:review.buttons.approve',
      defaultMessage: `Samþykkja`,
      description: 'Approve button in review process',
    },
  }),
  confirmationModal: defineMessages({
    title: {
      id: 'id.application:review.confirmationModal.title',
      defaultMessage: 'Umsókn hafnað',
      description: 'Confirmation modal reject title',
    },
    text: {
      id: 'id.application:review.confirmationModal.text',
      defaultMessage: `Þú ert að fara að hafna umsókn um 
      útgáfu nafnskírteinis fyrir barn: {childName}.  Ef 
      umsókninni er hafnað verður nafnskírteinið ekki 
      gefið út, umsóknin eyðist og það verður að hefja 
      umsóknarferlið að nýju ef ætlunin er að barnið 
      fái nafnkírteini.`,
      description: 'Confirmation modal reject text',
    },
    buttonText: {
      id: 'id.application:review.confirmationModal.buttonText',
      defaultMessage: 'Hafna tilkynningu',
      description: 'Confirmation modal reject button',
    },
    cancelButton: {
      id: 'id.application:review.confirmationModal.cancelButton',
      defaultMessage: 'Hætta við',
      description: 'Confirmation modal cancel button',
    },
  }),
}
