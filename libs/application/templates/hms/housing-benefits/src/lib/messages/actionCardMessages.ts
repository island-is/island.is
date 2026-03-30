import { defineMessages } from 'react-intl'

export const actionCardMessages = defineMessages({
  applicationTitle: {
    id: 'hb.application:actionCard.applicationTitle',
    defaultMessage: 'Umsókn um húsnæðisbætur',
    description: 'Application card heading',
  },
  cardTitleNoRental: {
    id: 'hb.application:actionCard.cardTitleNoRental',
    defaultMessage: 'Enginn leigusamningur',
    description: 'Application card heading when no rental agreement',
  },
  cardDescriptionDraftFull: {
    id: 'hb.application:actionCard.cardDescriptionDraftFull',
    defaultMessage: '{applicantName} · {address}',
    description:
      'Draft card description when both applicant name and rental address are known',
  },
  cardDescriptionDraftNameOnly: {
    id: 'hb.application:actionCard.cardDescriptionDraftNameOnly',
    defaultMessage: '{applicantName}',
    description: 'Draft card description when only applicant name is known',
  },
  cardDescriptionDraftAddressOnly: {
    id: 'hb.application:actionCard.cardDescriptionDraftAddressOnly',
    defaultMessage: '{address}',
    description: 'Draft card description when only rental address is known',
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
  historyDraftSubmitted: {
    id: 'hb.application:actionCard.historyDraftSubmitted',
    defaultMessage: 'Umsókn útfyllt af {applicantName}',
    description: 'History log when draft is submitted',
  },
  historyAssigneeApprovedWithName: {
    id: 'hb.application:actionCard.historyAssigneeApprovedWithName',
    defaultMessage: '{name} samþykkti gagnaöflun',
    description:
      'History log when a household assignee approves; {name} is the signatory',
  },
  historyAssigneeApprovedGeneric: {
    id: 'hb.application:actionCard.historyAssigneeApprovedGeneric',
    defaultMessage: 'Heimilismaður samþykkti umsóknina',
    description:
      'History log when assignee approves but the signatory name is unknown',
  },
  pendingTitleDraft: {
    id: 'hb.application:actionCard.pendingTitleDraft',
    defaultMessage: 'Vantar að ljúka umsókn',
    description: 'Pending action title in draft',
  },
  pendingContentDraft: {
    id: 'hb.application:actionCard.pendingContentDraft',
    defaultMessage:
      'Þú getur haldið áfram að fylla út umsóknina þegar þú opnar hana.',
    description:
      'Draft pending alert body (name and address are shown in the card description)',
  },
  pendingTitleAssigneeApplicant: {
    id: 'hb.application:actionCard.pendingTitleAssigneeApplicant',
    defaultMessage: 'Beðið eftir samþykki heimilismanna',
    description: 'Assignee flow — applicant pending title',
  },
  pendingContentAssigneeApplicant: {
    id: 'hb.application:actionCard.pendingContentAssigneeApplicant',
    defaultMessage:
      'Einn eða fleiri heimilismenn þurfa að samþykkja umsóknina áður en hún fer í vinnslu.',
    description: 'Assignee flow — applicant pending content',
  },
  pendingTitleAssigneePrereq: {
    id: 'hb.application:actionCard.pendingTitleAssigneePrereq',
    defaultMessage: 'Forkröfur heimilismanns',
    description: 'Assignee flow — prerequisite step not finished',
  },
  pendingContentAssigneePrereq: {
    id: 'hb.application:actionCard.pendingContentAssigneePrereq',
    defaultMessage:
      'Sem heimilismaður þarftu fyrst að staðfesta auðkenni þitt og ljúka forkröfum áður en þú getur samþykkt umsóknina.',
    description: 'Assignee flow — prerequisite step card text',
  },
  pendingTitleAssigneeUnsigned: {
    id: 'hb.application:actionCard.pendingTitleAssigneeUnsigned',
    defaultMessage: 'Þú þarft að samþykkja umsókn',
    description: 'Assignee flow — draft/sign step title',
  },
  pendingContentAssigneeUnsigned: {
    id: 'hb.application:actionCard.pendingContentAssigneeUnsigned',
    defaultMessage:
      'Sem heimilismaður þarftu að yfirfara og samþykkja umsókn um húsnæðisbætur.',
    description: 'Assignee flow — draft/sign step content',
  },
  pendingTitleAssigneeSigned: {
    id: 'hb.application:actionCard.pendingTitleAssigneeSigned',
    defaultMessage: 'Beðið eftir öðrum heimilismönnum',
    description: 'Assignee flow — signed assignee title',
  },
  pendingContentAssigneeSigned: {
    id: 'hb.application:actionCard.pendingContentAssigneeSigned',
    defaultMessage: 'Þú hefur samþykkt. Önnur samþykki eru enn í bið',
    description: 'Assignee flow — signed assignee content',
  },
  applicantSubmitDescription: {
    id: 'hb.application:actionCard.applicantSubmitDescription',
    defaultMessage:
      'Heimilismenn hafa samþykkt umsóknina. Staðfestu og sendu hana til HMS.',
    description:
      'Card description when application awaits final applicant submit after assignee approvals',
  },
  pendingTitleApplicantSubmit: {
    id: 'hb.application:actionCard.pendingTitleApplicantSubmit',
    defaultMessage: 'Staðfestu sendingu umsóknar',
    description:
      'Pending action title — applicant must confirm final submit to HMS',
  },
  pendingContentApplicantSubmit: {
    id: 'hb.application:actionCard.pendingContentApplicantSubmit',
    defaultMessage:
      'Opnaðu umsóknina, farðu yfir yfirlitið og sendu umsóknina til meðferðar hjá HMS. {applicantName} · {rentalAddress}',
    description:
      'Pending action body — instruct applicant to review overview and submit; placeholders from rental summary',
  },
  pendingTitleInReviewApplicant: {
    id: 'hb.application:actionCard.pendingTitleInReviewApplicant',
    defaultMessage: 'Umsókn í vinnslu',
    description: 'In review — applicant title',
  },
  pendingContentInReviewApplicant: {
    id: 'hb.application:actionCard.pendingContentInReviewApplicant',
    defaultMessage: 'Umsókn í vinnslu hjá HMS.',
    description: 'In review — applicant content',
  },
  pendingTitleInReviewInstitution: {
    id: 'hb.application:actionCard.pendingTitleInReviewInstitution',
    defaultMessage: 'Til meðferðar',
    description: 'In review — institution title',
  },
  pendingContentInReviewInstitution: {
    id: 'hb.application:actionCard.pendingContentInReviewInstitution',
    defaultMessage: 'Umsókn um húsnæðisbætur bíður afgreiðslu.',
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
  inReviewDescription: {
    id: 'hb.application:actionCard.inReviewDescription',
    defaultMessage:
      'Umsóknin er komin inn til HMS til vinnslu og verður tekin fyrir sem fyrst',
    description: 'In review state description',
  },
})
