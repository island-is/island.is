import { defineMessages } from 'react-intl'

export const m = defineMessages({
  // General
  applicationSystem: {
    id: 'admin-portal.application-system:name',
    defaultMessage: 'Umsóknarkerfi',
  },
  applicationSystemDescription: {
    id: 'admin-portal.application-system:description',
    defaultMessage: 'Tölfræðigögn og umsjá umsóknarkerfis',
  },
  overview: {
    id: 'admin-portal.application-system:overview',
    defaultMessage: 'Yfirlit',
  },
  applicationSystemApplications: {
    id: 'admin-portal.application-system:applications',
    defaultMessage: 'Umsóknir',
  },
  applicationSystemApplicationsDescription: {
    id: 'admin-portal.application-system:applicationsDescription',
    defaultMessage:
      'Athugið að til að fá nákvæmari leitarniðurstöður er gott að velja tegund umsóknar. Eingöngu er hægt að leita í kennitölu umsækjanda þegar leitað er í öllum umsóknarflokkum í einu.',
  },
  pleaseEnterValueToBeingSearch: {
    id: 'admin-portal.application-system:pleaseEnterValueToBeingSearch',
    defaultMessage: 'Sláðu inn kennitölu til að byrja leit',
  },
  createDiscount: {
    id: 'admin-portal.application-system:createDiscount',
    defaultMessage: 'Handvirkir kóðar',
  },
  openApplication: {
    id: 'admin-portal.application-system:openApplication',
    defaultMessage: 'Opna umsókn',
  },
  date: {
    id: 'admin-portal.application-system:date',
    defaultMessage: 'Dagsetning',
  },
  dateCreated: {
    id: 'admin-portal.application-system:dateCreated',
    defaultMessage: 'Umsókn stofnuð',
  },
  dateModified: {
    id: 'admin-portal.application-system:dateModified',
    defaultMessage: 'Síðast breytt',
  },
  application: {
    id: 'admin-portal.application-system:application',
    defaultMessage: 'Umsókn',
  },
  applicationType: {
    id: 'admin-portal.application-system:applicationType',
    defaultMessage: 'Tegund umsóknar',
  },
  applicationTypeDropdownPlaceholder: {
    id: 'admin-portal.application-system:applicationTypeDropdownPlaceholder',
    defaultMessage: 'Veldu tegund',
  },
  applicant: {
    id: 'admin-portal.application-system:applicant',
    defaultMessage: 'Umsækjandi',
  },
  procurer: {
    id: 'admin-portal.application-system:procurer',
    defaultMessage: 'Umboðshafi',
  },
  otherData: {
    id: 'admin-portal.application-system:otherData',
    defaultMessage: 'Önnur gögn',
  },
  name: {
    id: 'admin-portal.application-system:name',
    defaultMessage: 'Nafn',
  },
  nationalId: {
    id: 'admin-portal.application-system:nationalId',
    defaultMessage: 'Kennitala',
  },
  applicantNationalId: {
    id: 'admin-portal.application-system:applicantNationalId',
    defaultMessage: 'Kennitala umsækjanda',
  },
  email: {
    id: 'admin-portal.application-system:email',
    defaultMessage: 'Netfang',
  },
  phone: {
    id: 'admin-portal.application-system:phone',
    defaultMessage: 'Sími',
  },
  institution: {
    id: 'admin-portal.application-system:institution',
    defaultMessage: 'Stofnun',
  },
  institutionDropdownPlaceholder: {
    id: 'admin-portal.application-system:institutionDropdownPlaceholder',
    defaultMessage: 'Veldu stofnun',
  },
  status: {
    id: 'admin-portal.application-system:status',
    defaultMessage: 'Staða',
  },
  notFound: {
    id: 'admin-portal.application-system:notFound',
    defaultMessage: 'Engar umsóknir fundust',
  },
  openApplicationHistory: {
    id: 'admin-portal.application-system:openApplicationHistory',
    defaultMessage: 'Opna umsóknarsögu',
  },
  closeApplicationHistory: {
    id: 'admin-portal.application-system:closeApplicationHistory',
    defaultMessage: 'Loka umsóknarsögu',
  },
  copyLinkToApplication: {
    id: 'admin-portal.application-system:copyLinkToApplication',
    defaultMessage: 'Afrita tengil á umsókn',
  },
  copyApplicationId: {
    id: 'admin-portal.application-system:copyApplicationId',
    defaultMessage: 'Afrita ID á umsókn',
  },
  copyLinkSuccessful: {
    id: 'admin-portal.application-system:copyLinkSuccessful',
    defaultMessage: 'Tengill afritaður',
  },
  copyIdSuccessful: {
    id: 'admin-portal.application-system:copyIdSuccessful',
    defaultMessage: 'ID afritað',
  },
  applicationPruned: {
    id: 'admin-portal.application-system:applicationPruned',
    defaultMessage: 'Öllum gögnum úr þessari umsókn hefur verið eytt.',
  },

  // Tags
  tagsInProgress: {
    id: 'admin-portal.application-system:tags.inProgress',
    defaultMessage: 'Í ferli',
  },
  tagsDone: {
    id: 'admin-portal.application-system:tags.completed',
    defaultMessage: 'Lokið',
  },
  tagsRejected: {
    id: 'admin-portal.application-system:tags.rejected',
    defaultMessage: 'Hafnað',
  },
  tagsApproved: {
    id: 'admin-portal.application-system:tags.approved',
    defaultMessage: 'Samþykkt',
  },
  tagsDraft: {
    id: 'admin-portal.application-system:tags.draft',
    defaultMessage: 'Í vinnslu',
  },
  tagsRequiresAction: {
    id: 'admin-portal.application-system:tags.requiresAction',
    defaultMessage: 'Krefst aðgerða',
  },
  tagsAll: {
    id: 'admin-portal.application-system:tags.all',
    defaultMessage: 'Allar',
  },
  newApplication: {
    id: 'admin-portal.application-system:new.application',
    defaultMessage: 'Ný umsókn',
  },
  statistics: {
    id: 'admin-portal.application-system:statistics',
    defaultMessage: 'Tölfræði',
  },
  translations: {
    id: 'admin-portal.application-system:translations',
    defaultMessage: 'Þýðingar',
  },
  translationsDescription: {
    id: 'admin-portal.application-system:translationsDescription',
    defaultMessage: 'Þýðingar á umsóknum',
  },
  translationProgress: {
    id: 'admin-portal.application-system:translationProgress',
    defaultMessage: '{translated} af {total} þýtt',
  },
  translationOpen: {
    id: 'admin-portal.application-system:translationOpen',
    defaultMessage: 'Opna þýðingar',
  },
  sharedTranslationSpaces: {
    id: 'admin-portal.application-system:sharedTranslationSpaces',
    defaultMessage: 'Sameiginleg þýðingasvæði',
  },
  sharedTranslationNamespace: {
    id: 'admin-portal.application-system:sharedTranslationNamespace',
    defaultMessage: 'Nafnarammi',
  },
  sharedTranslationUsedBy: {
    id: 'admin-portal.application-system:sharedTranslationUsedBy',
    defaultMessage: 'Notað af',
  },
  sharedTranslationNamespaceEmpty: {
    id: 'admin-portal.application-system:sharedTranslationNamespaceEmpty',
    defaultMessage: 'Engar þýðanlegar strengir fundust fyrir þetta svæði.',
  },
  translationBackToList: {
    id: 'admin-portal.application-system:translationBackToList',
    defaultMessage: 'Til baka',
  },
  translationSave: {
    id: 'admin-portal.application-system:translationSave',
    defaultMessage: 'Vista',
  },
  translationSaveAll: {
    id: 'admin-portal.application-system:translationSaveAll',
    defaultMessage: 'Vista allt',
  },
  translationStatesNavHide: {
    id: 'admin-portal.application-system:translationStatesNavHide',
    defaultMessage: 'Fela vallista yfir stöður',
  },
  translationStatesNavShow: {
    id: 'admin-portal.application-system:translationStatesNavShow',
    defaultMessage: 'Sýna vallista yfir stöður',
  },
  translationStatesNavDrawerAriaLabel: {
    id: 'admin-portal.application-system:translationStatesNavDrawerAriaLabel',
    defaultMessage: 'Yfirlit yfir stöður og skjái',
  },
  translationSaveFailed: {
    id: 'admin-portal.application-system:translationSaveFailed',
    defaultMessage: 'Ekki tókst að vista. {detail}',
  },
  translationValidationErrors: {
    id: 'admin-portal.application-system:translationValidationErrors',
    defaultMessage: 'Villumeldingar',
  },
  translationGoogleTranslate: {
    id: 'admin-portal.application-system:translationGoogleTranslate',
    defaultMessage: 'Þýða',
  },
  translationGoogleTranslateAll: {
    id: 'admin-portal.application-system:translationGoogleTranslateAll',
    defaultMessage: 'Þýða allt',
  },
  translationStringsScopeScreen: {
    id: 'admin-portal.application-system:translationStringsScopeScreen',
    defaultMessage: 'Texti á þessum skjá',
  },
  translationStringsScopeApplication: {
    id: 'admin-portal.application-system:translationStringsScopeApplication',
    defaultMessage: 'Texti í allri umsókninni',
  },
  translationStringsAllApplicationHeading: {
    id: 'admin-portal.application-system:translationStringsAllApplicationHeading',
    defaultMessage: 'Allur texti í umsókn',
  },
  translationReview: {
    id: 'admin-portal.application-system:translationReview',
    defaultMessage: 'Samþykkja',
  },
  translationReviewAll: {
    id: 'admin-portal.application-system:translationReviewAll',
    defaultMessage: 'Samþykkja allt',
  },
  statisticsDescription: {
    id: 'admin-portal.application-system:statisticsDescription',
    defaultMessage:
      'Staður til að sækja tölfræði um umsóknir og skoða gröf tengd þeim.',
  },
  translationFieldsTab: {
    id: 'admin-portal.application-system:translationFieldsTab',
    defaultMessage: 'Fields',
  },
  translationFieldAutofill: {
    id: 'admin-portal.application-system:translationFieldAutofill',
    defaultMessage: 'Autofill',
  },
  translationFieldShowError: {
    id: 'admin-portal.application-system:translationFieldShowError',
    defaultMessage: 'Show error',
  },
  translationFieldNoFields: {
    id: 'admin-portal.application-system:translationFieldNoFields',
    defaultMessage: 'No fields on this screen',
  },
  translationFieldPrevious: {
    id: 'admin-portal.application-system:translationFieldPrevious',
    defaultMessage: 'Previous',
  },
  translationFieldNext: {
    id: 'admin-portal.application-system:translationFieldNext',
    defaultMessage: 'Next',
  },

  // Filters
  clearFilter: {
    id: 'admin-portal.application-system:clearFilter',
    defaultMessage: 'Hreinsa síu',
  },
  clearAllFilters: {
    id: 'admin-portal.application-system:clearAllFilters',
    defaultMessage: 'Hreinsa allar síur',
  },
  openFilter: {
    id: 'admin-portal.application-system:openFilter',
    defaultMessage: 'Opna síu',
  },
  closeFilter: {
    id: 'admin-portal.application-system:closeFilter',
    defaultMessage: 'Loka síu',
  },
  filter: {
    id: 'admin-portal.application-system:filter',
    defaultMessage: 'Sía',
  },
  filterResults: {
    id: 'admin-portal.application-system:filterResults',
    defaultMessage: 'Sjá niðurstöður',
  },
  clearSelected: {
    id: 'admin-portal.application-system:clearSelected',
    defaultMessage: 'Hreinsa val',
  },
  searchPlaceholder: {
    id: 'admin-portal.application-system:searchPlaceholder',
    defaultMessage: 'Sláðu inn kennitölu',
  },
  searchApplicantPlaceholder: {
    id: 'admin-portal.application-system:searchApplicantPlaceholder',
    defaultMessage: 'Kennitala umsækjanda',
  },
  searchApplicantError: {
    id: 'admin-portal.application-system:searchApplicantError',
    defaultMessage: 'Kennitala verður að vera 10 tölustafir',
  },
  searchStrPlaceholder: {
    id: 'admin-portal.application-system:searchStrPlaceholder',
    defaultMessage: 'Sláðu inn leitarorð',
  },
  datePlaceholder: {
    id: 'admin-portal.application-system:datePlaceholder',
    defaultMessage: 'Veldu dagsetningu',
  },
  searchStr: {
    id: 'admin-portal.application-system:searchStr',
    defaultMessage: 'Leitarorð',
  },
  filterFrom: {
    id: 'admin-portal.application-system:filterFrom',
    defaultMessage: 'Frá',
  },
  filterTo: {
    id: 'admin-portal.application-system:filterTo',
    defaultMessage: 'Til',
  },
  resultCount: {
    id: 'admin-portal.application-system:resultCount',
    defaultMessage: '{count} umsóknir fundust',
  },
  tableHeaderInstitution: {
    id: 'admin-portal.application-system:tableHeaderInstitution',
    defaultMessage: 'Stofnun',
  },
  tableHeaderType: {
    id: 'admin-portal.application-system:tableHeaderType',
    defaultMessage: 'Týpa',
  },
  tableHeaderTotal: {
    id: 'admin-portal.application-system:tableHeaderTotal',
    defaultMessage: 'Samtals',
  },
  tableHeaderDraft: {
    id: 'admin-portal.application-system:tableHeaderDraft',
    defaultMessage: 'Drög',
  },
  tableHeaderInProgress: {
    id: 'admin-portal.application-system:tableHeaderInProgress',
    defaultMessage: 'Í vinnslu',
  },
  tableHeaderCompleted: {
    id: 'admin-portal.application-system:tableHeaderCompleted',
    defaultMessage: 'Lokið',
  },
  tableHeaderApproved: {
    id: 'admin-portal.application-system:tableHeaderApproved',
    defaultMessage: 'Samþykkt',
  },
  tableHeaderRejected: {
    id: 'admin-portal.application-system:tableHeaderRejected',
    defaultMessage: 'Hafnað',
  },
  noData: {
    id: 'admin-portal.application-system:noData',
    defaultMessage: 'Engin gögn fundust á tímabilinu...',
  },

  // Translation workspace: draft / publish
  translationSaveDraft: {
    id: 'admin-portal.application-system:translationSaveDraft',
    defaultMessage: 'Vista drög',
  },
  translationAutosaved: {
    id: 'admin-portal.application-system:translationAutosaved',
    defaultMessage: 'Sjálfvirk vistun kl. {time}',
  },
  translationPublish: {
    id: 'admin-portal.application-system:translationPublish',
    defaultMessage: 'Birta',
  },
  translationPublishConfirm: {
    id: 'admin-portal.application-system:translationPublishConfirm',
    defaultMessage:
      'Ertu viss um að þú viljir birta þessar þýðingar? Þær verða sýnilegar notendum.',
  },
  translationPublishCancel: {
    id: 'admin-portal.application-system:translationPublishCancel',
    defaultMessage: 'Hætta við',
  },
  translationPublishSuccess: {
    id: 'admin-portal.application-system:translationPublishSuccess',
    defaultMessage: 'Þýðingar hafa verið birtar.',
  },
  translationPublishFailed: {
    id: 'admin-portal.application-system:translationPublishFailed',
    defaultMessage: 'Ekki tókst að birta þýðingar. {detail}',
  },
  translationPublishHistory: {
    id: 'admin-portal.application-system:translationPublishHistory',
    defaultMessage: 'Útgáfusaga',
  },
  translationRollback: {
    id: 'admin-portal.application-system:translationRollback',
    defaultMessage: 'Endurheimta',
  },
  translationRollbackConfirm: {
    id: 'admin-portal.application-system:translationRollbackConfirm',
    defaultMessage:
      'Ertu viss um að þú viljir endurheimta þessa útgáfu? Núverandi birtar þýðingar verða yfirskrifaðar.',
  },
  translationRollbackSuccess: {
    id: 'admin-portal.application-system:translationRollbackSuccess',
    defaultMessage: 'Þýðingar hafa verið endurheimtar.',
  },
  translationRollbackFailed: {
    id: 'admin-portal.application-system:translationRollbackFailed',
    defaultMessage: 'Ekki tókst að endurheimta þýðingar. {detail}',
  },
  translationDraft: {
    id: 'admin-portal.application-system:translationDraft',
    defaultMessage: 'Drög',
  },
  translationPublished: {
    id: 'admin-portal.application-system:translationPublished',
    defaultMessage: 'Birt',
  },
  translationNoPublishHistory: {
    id: 'admin-portal.application-system:translationNoPublishHistory',
    defaultMessage: 'Engin útgáfusaga.',
  },
  translationCurrentVersion: {
    id: 'admin-portal.application-system:translationCurrentVersion',
    defaultMessage: 'Núverandi',
  },
  translationPublishedByLabel: {
    id: 'admin-portal.application-system:translationPublishedByLabel',
    defaultMessage: 'Kennitala: {nationalId}',
  },
  translationActorLabel: {
    id: 'admin-portal.application-system:translationActorLabel',
    defaultMessage: 'Umboðsaðili: {actorNationalId}',
  },
  translationWorkspaceOverviewPreviewHint: {
    id: 'admin-portal.application-system:translationWorkspaceOverviewPreviewHint',
    defaultMessage:
      'Raðir í yfirliti koma fram út frá svörum í umsókn. Þýðingahamur sýnir aðeins útlit; texta sem birtist mögulega hér má finna undir "Strengir" -> "Texti í allri umsókninni"',
  },
  translationWorkspaceOverviewPreviewStubKey: {
    id: 'admin-portal.application-system:translationWorkspaceOverviewPreviewStubKey',
    defaultMessage: 'Dálkur',
  },
  translationWorkspaceOverviewPreviewStubValue: {
    id: 'admin-portal.application-system:translationWorkspaceOverviewPreviewStubValue',
    defaultMessage: 'Gildi',
  },
})
