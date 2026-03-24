import { defineMessages } from 'react-intl'

export const actionCardMessages = defineMessages({
  cardTitleNoRental: {
    id: 'hb.application:actionCard.cardTitleNoRental',
    defaultMessage: 'Enginn leigusamningur',
    description: 'Application card heading when no rental agreement',
  },
  cardTitleDraft: {
    id: 'hb.application:actionCard.cardTitleDraft',
    defaultMessage: 'Húsnæðisbætur — drög',
    description:
      'Application card heading in draft when address and applicant name are unavailable',
  },
  cardTitleDraftWithAddressAndApplicant: {
    id: 'hb.application:actionCard.cardTitleDraftWithAddressAndApplicant',
    defaultMessage: 'Húsnæðisbætur – {address} – {applicantName}',
    description: 'Draft application card heading with rental address and applicant',
  },
  cardTitleDraftWithApplicantOnly: {
    id: 'hb.application:actionCard.cardTitleDraftWithApplicantOnly',
    defaultMessage: 'Húsnæðisbætur – {applicantName}',
    description:
      'Draft application card heading when no rental is selected (no address)',
  },
  cardTitleDraftWithAddressOnly: {
    id: 'hb.application:actionCard.cardTitleDraftWithAddressOnly',
    defaultMessage: 'Húsnæðisbætur – {address}',
    description:
      'Draft application card heading when address exists but applicant name is missing',
  },
  cardTitleAssignee: {
    id: 'hb.application:actionCard.cardTitleAssignee',
    defaultMessage: 'Samþykki heimilismanna',
    description: 'Application card heading during assignee approval',
  },
  cardTitleInReview: {
    id: 'hb.application:actionCard.cardTitleInReview',
    defaultMessage: 'Í vinnslu hjá stofnun',
    description: 'Application card heading while in institution review',
  },
  cardTitleExtraData: {
    id: 'hb.application:actionCard.cardTitleExtraData',
    defaultMessage: 'Viðbótargögn óskast',
    description: 'Application card heading when extra data requested',
  },
  cardTitleApproved: {
    id: 'hb.application:actionCard.cardTitleApproved',
    defaultMessage: 'Umsókn samþykkt',
    description: 'Application card heading when approved',
  },
  cardTitleRejected: {
    id: 'hb.application:actionCard.cardTitleRejected',
    defaultMessage: 'Umsókn hafnað',
    description: 'Application card heading when rejected',
  },
  pendingTitleNoRental: {
    id: 'hb.application:actionCard.pendingTitleNoRental',
    defaultMessage: 'Enginn gildur leigusamningur fannst',
    description: 'Pending action title when no rental',
  },
  pendingContentNoRental: {
    id: 'hb.application:actionCard.pendingContentNoRental',
    defaultMessage:
      'Til að sækja um húsnæðisbætur þarf að vera virkur leigusamningur sem uppfyllir skilyrði stofnunarinnar.',
    description: 'Pending action description when no rental',
  },
  pendingTitleDraft: {
    id: 'hb.application:actionCard.pendingTitleDraft',
    defaultMessage: 'Vantar að ljúka umsókn',
    description: 'Pending action title in draft',
  },
  pendingContentDraft: {
    id: 'hb.application:actionCard.pendingContentDraft',
    defaultMessage:
      '{applicantName} · {rentalAddress}',
    description: 'Applicant and rental address on draft card',
  },
  pendingTitleAssigneeApplicant: {
    id: 'hb.application:actionCard.pendingTitleAssigneeApplicant',
    defaultMessage: 'Beðið eftir samþykki heimilismanna',
    description: 'Assignee flow — applicant pending title',
  },
  pendingContentAssigneeApplicant: {
    id: 'hb.application:actionCard.pendingContentAssigneeApplicant',
    defaultMessage:
      'Ein eða fleiri heimilismenn þurfa að samþykkja umsóknina áður en hún fer í vinnslu. {applicantName} · {rentalAddress}',
    description: 'Assignee flow — applicant pending content',
  },
  pendingTitleAssigneeUnsigned: {
    id: 'hb.application:actionCard.pendingTitleAssigneeUnsigned',
    defaultMessage: 'Þú þarft að samþykkja umsókn',
    description: 'Assignee flow — unsigned assignee title',
  },
  pendingContentAssigneeUnsigned: {
    id: 'hb.application:actionCard.pendingContentAssigneeUnsigned',
    defaultMessage:
      'Sem heimilismaður þarftu að yfirfara og samþykkja umsókn um húsnæðisbætur. {applicantName} · {rentalAddress}',
    description: 'Assignee flow — unsigned assignee content',
  },
  pendingTitleAssigneeSigned: {
    id: 'hb.application:actionCard.pendingTitleAssigneeSigned',
    defaultMessage: 'Beðið eftir öðrum heimilismönnum',
    description: 'Assignee flow — signed assignee title',
  },
  pendingContentAssigneeSigned: {
    id: 'hb.application:actionCard.pendingContentAssigneeSigned',
    defaultMessage:
      'Þú hefur samþykkt. Önnur samþykki eru enn í bið. {applicantName} · {rentalAddress}',
    description: 'Assignee flow — signed assignee content',
  },
  pendingTitleInReviewApplicant: {
    id: 'hb.application:actionCard.pendingTitleInReviewApplicant',
    defaultMessage: 'Umsókn í vinnslu',
    description: 'In review — applicant title',
  },
  pendingContentInReviewApplicant: {
    id: 'hb.application:actionCard.pendingContentInReviewApplicant',
    defaultMessage:
      'Umsóknin er nú til meðferðar hjá stofnun. {applicantName} · {rentalAddress}',
    description: 'In review — applicant content',
  },
  pendingTitleInReviewInstitution: {
    id: 'hb.application:actionCard.pendingTitleInReviewInstitution',
    defaultMessage: 'Til meðferðar',
    description: 'In review — institution title',
  },
  pendingContentInReviewInstitution: {
    id: 'hb.application:actionCard.pendingContentInReviewInstitution',
    defaultMessage:
      'Umsókn um húsnæðisbætur bíður afgreiðslu. {applicantName} · {rentalAddress}',
    description: 'In review — institution content',
  },
  pendingTitleExtraData: {
    id: 'hb.application:actionCard.pendingTitleExtraData',
    defaultMessage: 'Viðbótargögn þarf að skila',
    description: 'Extra data state title',
  },
  pendingContentExtraData: {
    id: 'hb.application:actionCard.pendingContentExtraData',
    defaultMessage:
      'Stofnun bað um viðbótargögn eða skýringar. Skilaðu þeim hér til að halda áfram með málið. {applicantName} · {rentalAddress}',
    description: 'Extra data state content',
  },
  pendingTitleApproved: {
    id: 'hb.application:actionCard.pendingTitleApproved',
    defaultMessage: 'Umsókn samþykkt',
    description: 'Approved state title',
  },
  pendingContentApproved: {
    id: 'hb.application:actionCard.pendingContentApproved',
    defaultMessage:
      'Umsóknin þín um húsnæðisbætur hefur verið samþykkt. {applicantName} · {rentalAddress}',
    description: 'Approved state content',
  },
  pendingTitleRejected: {
    id: 'hb.application:actionCard.pendingTitleRejected',
    defaultMessage: 'Umsókn hafnað',
    description: 'Rejected state title',
  },
  pendingContentRejected: {
    id: 'hb.application:actionCard.pendingContentRejected',
    defaultMessage:
      'Umsóknin þín um húsnæðisbætur var hafnað. Þú getur skoðað nánari upplýsingar í umsókninni. {applicantName} · {rentalAddress}',
    description: 'Rejected state content',
  },
})
