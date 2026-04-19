import { defineMessages } from 'react-intl'

export const institutionMessages = defineMessages({
  sectionTitle: {
    id: 'hb.application:institution.sectionTitle',
    defaultMessage: 'Meðferð umsóknar',
    description: 'Institution review section title',
  },
  description1: {
    id: 'hb.application:institution.description1',
    defaultMessage:
      'Umsóknin er komin í vinnslu hjá Húsnæðis- og mannvirkjastofnun. Hér geturðu samþykkt, hafnað eða óskað eftir viðbótargögnum.',
    description: 'Institution review intro',
  },
  description2: {
    id: 'hb.application:institution.description2',
    defaultMessage:
      'Ef umsókn er hafnað skal skrá skýringu sem umsækjandi getur séð. Ef beðið er um gögn skal tilgreina skjöl og skilaboð til umsækjanda.',
    description: 'Institution review secondary hint',
  },
  approveOption: {
    id: 'hb.application:institution.approveOption',
    defaultMessage: 'Samþykkja umsókn',
    description: 'Approve application option',
  },
  rejectOption: {
    id: 'hb.application:institution.rejectOption',
    defaultMessage: 'Hafna umsókn',
    description: 'Reject application option',
  },
  requestExtraDataOption: {
    id: 'hb.application:institution.requestExtraDataOption',
    defaultMessage: 'Óska eftir viðbótargögnum',
    description: 'Request additional data option',
  },
  rejectionTitle: {
    id: 'hb.application:institution.rejectionTitle',
    defaultMessage: 'Þú ert að hafna umsókninni',
    description: 'Title when reject is selected',
  },
  rejectionDescription: {
    id: 'hb.application:institution.rejectionDescription',
    defaultMessage: 'Vinsamlegast gefðu upp ástæðu fyrir höfnun.',
    description: 'Description for rejection reason field',
  },
  rejectionReasonLabel: {
    id: 'hb.application:institution.rejectionReasonLabel',
    defaultMessage: 'Ástæða höfnunar',
    description: 'Rejection reason field label',
  },
  rejectionReasonPlaceholder: {
    id: 'hb.application:institution.rejectionReasonPlaceholder',
    defaultMessage: 'Skráðu ástæðu fyrir höfnun …',
    description: 'Rejection reason placeholder',
  },
  rejectionWarningTitle: {
    id: 'hb.application:institution.rejectionWarningTitle',
    defaultMessage: 'Athugið',
    description: 'Rejection warning alert title',
  },
  rejectionWarningMessage: {
    id: 'hb.application:institution.rejectionWarningMessage',
    defaultMessage:
      'Þessi aðgerð er ætlað að vera endanleg eftir að umsókn hefur verið hafnað.',
    description: 'Rejection warning message',
  },
  approveButton: {
    id: 'hb.application:institution.approveButton',
    defaultMessage: 'Samþykkja',
    description: 'Approve submit button',
  },
  rejectButton: {
    id: 'hb.application:institution.rejectButton',
    defaultMessage: 'Hafna',
    description: 'Reject submit button',
  },
  requestExtraDataTitle: {
    id: 'hb.application:institution.requestExtraDataTitle',
    defaultMessage: 'Óska eftir gögnum',
    description: 'Title when request extra data is selected',
  },
  requestExtraDataDescription: {
    id: 'hb.application:institution.requestExtraDataDescription',
    defaultMessage:
      'Veldu hvaða skjöl þú vilt fá sent inn og skrifaðu skilaboð til umsækjanda.',
    description: 'Description for extra data request fields',
  },
  requestExtraDataDocumentsLabel: {
    id: 'hb.application:institution.requestExtraDataDocumentsLabel',
    defaultMessage: 'Skjöl sem óskað er eftir',
    description: 'Checkbox group label for requested documents',
  },
  requestExtraDataMessageLabel: {
    id: 'hb.application:institution.requestExtraDataMessageLabel',
    defaultMessage: 'Skilaboð til umsækjanda',
    description: 'Message to applicant field label',
  },
  requestExtraDataMessagePlaceholder: {
    id: 'hb.application:institution.requestExtraDataMessagePlaceholder',
    defaultMessage: 'Skráðu skilaboð sem umsækjandi sér …',
    description: 'Placeholder for message to applicant',
  },
  requestExtraDataButton: {
    id: 'hb.application:institution.requestExtraDataButton',
    defaultMessage: 'Senda beiðni',
    description: 'Submit request for extra data',
  },
  approvedTitle: {
    id: 'hb.application:institution.approvedTitle',
    defaultMessage: 'Umsókn samþykkt',
    description: 'Approved state conclusion title',
  },
  approvedMessage: {
    id: 'hb.application:institution.approvedMessage',
    defaultMessage:
      'Umsóknin hefur verið samþykkt. Hægt er að fylgjast með stöðu þinna húsnæðisbóta inni á Míum síðum.',
    description: 'Approved state conclusion message',
  },
  rejectedTitle: {
    id: 'hb.application:institution.rejectedTitle',
    defaultMessage: 'Umsókn hafnað',
    description: 'Rejected state conclusion title',
  },
  rejectedMessage: {
    id: 'hb.application:institution.rejectedMessage',
    defaultMessage: 'Umsókn þinni um húsnæðisbætur hefur verið hafnað.',
    description: 'Rejected state conclusion message',
  },
  rejectedReasonEmpty: {
    id: 'hb.application:institution.rejectedReasonEmpty',
    defaultMessage: 'Engin ástæða var skráð.',
    description: 'Shown when institution did not provide a rejection reason',
  },
  validationRejectionReasonRequired: {
    id: 'hb.application:institution.validationRejectionReasonRequired',
    defaultMessage: 'Ástæða höfnunar er nauðsynleg',
    description: 'Validation when reject is chosen without reason',
  },
  validationExtraDataDocumentsRequired: {
    id: 'hb.application:institution.validationExtraDataDocumentsRequired',
    defaultMessage: 'Veldu að minnsta kosti eitt skjal sem óskað er eftir',
    description: 'Validation when extra data is chosen without documents',
  },
  validationExtraDataMessageRequired: {
    id: 'hb.application:institution.validationExtraDataMessageRequired',
    defaultMessage: 'Skilaboð til umsækjanda eru nauðsynleg',
    description: 'Validation when extra data is chosen without message',
  },
})
