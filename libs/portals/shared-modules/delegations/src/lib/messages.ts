import { defineMessages } from 'react-intl'

export const m = defineMessages({
  chooseDelegation: {
    id: 'sp.access-control-delegations:choose-tabs',
    defaultMessage: 'Veldu umboð',
    description: 'Choose delegation',
  },
  noOutgoingDelegations: {
    id: 'sp.access-control-delegations:empty-outgoing',
    defaultMessage: 'Umboð sem þú hefur veitt öðrum munu birtast hér.',
  },
  noIncomingDelegations: {
    id: 'sp.access-control-delegations:empty-incoming',
    defaultMessage: 'Þegar aðrir hafa veitt þér umboð birtast þau hér.',
  },
  noDelegationsImageAlt: {
    id: 'sp.access-control-delegations:empty-image-alt',
    defaultMessage: 'Mynd af handarbandi',
  },
  searchPlaceholder: {
    id: 'sp.access-control-delegations:search-placeholder',
    defaultMessage: 'Leita eftir nafni eða kt.',
  },
  searchAllPlaceholder: {
    id: 'sp.access-control-delegations:search-all-placeholder',
    defaultMessage: 'Leita í öllum umboðum',
  },
  delegationTypeCustom: {
    id: 'sp.access-control-delegations:delegation-type-custom',
    defaultMessage: 'Umboð',
  },
  delegationTypeLegalGuardian: {
    id: 'sp.access-control-delegations:delegation-type-legal-guardian',
    defaultMessage: 'Forsjá',
  },
  delegationTypeGeneralMandate: {
    id: 'sp.access-control-delegations:delegation-type-general-mandate',
    defaultMessage: 'Allsherjarumboð',
  },
  delegationTypeGeneralMandateOutgoing: {
    id: 'sp.access-control-delegations:delegation-type-general-mandate-outgoing',
    defaultMessage: 'Allsherjarumboð þú hefur veitt öðrum',
  },
  delegationTypeGeneralMandateIncoming: {
    id: 'sp.access-control-delegations:delegation-type-general-mandate-incoming',
    defaultMessage: 'Allsherjarumboð sem þú hefur fengið',
  },
  delegationTypeProcurationHolder: {
    id: 'sp.access-control-delegations:delegation-type-procuration-holder',
    defaultMessage: 'Prókúra',
  },
  delegationTypePersonalRepresentative: {
    id: 'sp.access-control-delegations:delegation-type-personal-representative',
    defaultMessage: 'Pers. talsmaður',
  },
  delegationTypeCustomDesc: {
    id: 'sp.access-control-delegations:delegation-type-custom-desc',
    defaultMessage: 'Umboð sem eru veitt í aðgangstýringarkerfi Ísland.is',
  },
  delegationTypeLegalGuardianDesc: {
    id: 'sp.access-control-delegations:delegation-type-legal-guardian-desc',
    defaultMessage: 'Eru sótt úr forsjárskrá Þjóðskrár',
  },
  delegationTypeProcurationHolderDesc: {
    id: 'sp.access-control-delegations:delegation-type-procuration-holder-desc',
    defaultMessage: 'Eru sótt úr fyrirtækjaskrá Skattsins',
  },
  delegationTypePersonalRepresentativeDesc: {
    id: 'sp.access-control-delegations:delegation-type-personal-representative-desc',
    defaultMessage: 'Samningar frá Réttindagæslu fatlaðra',
  },
  outgoingDelegationsHeader: {
    id: 'sp.access-control-delegations:outgoing-delegations-header',
    defaultMessage: 'Umboð frá þér',
  },
  incomingDelegationsHeader: {
    id: 'sp.access-control-delegations:incoming-delegations-header',
    defaultMessage: 'Umboð til þín',
  },
  outgoingDelegationsTitle: {
    id: 'sp.access-control-delegations:outgoing-delegations-title',
    defaultMessage: 'Umboð sem þú hefur veitt öðrum',
  },
  incomingCustomDelegationsTitle: {
    id: 'sp.access-control-delegations:incoming-custom-delegations-title',
    defaultMessage: 'Umboð sem þér hefur verið veitt',
  },
  accessControl: {
    id: 'sp.access-control-delegations:accessControl',
    defaultMessage: 'Aðgangsstýring',
  },
  digitalDelegations: {
    id: 'sp.access-control-delegations:digital-delegations',
    defaultMessage: 'Rafræn umboð',
  },
  myDelegations: {
    id: 'sp.access-control-delegations:my-delegations',
    defaultMessage: 'Mín umboð',
  },
  serviceCategories: {
    id: 'sp.access-control-delegations:serviceCategories',
    defaultMessage: 'Þjónustuflokkar',
  },
  categoryDetails: {
    id: 'sp.access-control-delegations:categoryDetails',
    defaultMessage: 'Þjónustuflokkur',
  },
  faq: {
    id: 'sp.access-control-delegations:faq',
    defaultMessage: 'Algengar spurningar og svör',
  },
  serviceCategoriesDescription: {
    id: 'sp.access-control-delegations:serviceCategoriesDescription',
    defaultMessage:
      'Hér má sjá yfirlit yfir þjónustuflokka og réttindi sem þeim tengjast.',
  },
  whichDelegationsSuit: {
    id: 'sp.access-control-delegations:whichDelegationsSuit',
    defaultMessage: 'Hvaða umboð henta í hvaða tilvikum?',
  },
  delegationTypes: {
    id: 'sp.access-control-delegations:delegationTypes',
    defaultMessage: 'Tegundir umboða',
  },
  delegationsThatSuit: {
    id: 'sp.access-control-delegations:delegationsThatSuit',
    defaultMessage: 'Rafræn umboð sem henta',
  },
  errorTitle: {
    id: 'sp.access-control-delegations:errorTitle',
    defaultMessage: 'Villa kom upp',
  },
  errorLoadingCategories: {
    id: 'sp.access-control-delegations:errorLoadingCategories',
    defaultMessage: 'Ekki tókst að sækja þjónustuflokka',
  },
  noCategoriesAvailable: {
    id: 'sp.access-control-delegations:noCategoriesAvailable',
    defaultMessage: 'Engir þjónustuflokkar í boði',
  },
  noScopesInCategory: {
    id: 'sp.access-control-delegations:noScopesInCategory',
    defaultMessage: 'Engin réttindi í þessum flokki',
  },
  viewPermissions: {
    id: 'sp.access-control-delegations:viewPermissions',
    defaultMessage: 'Skoða réttindi',
  },
  loadingPermissions: {
    id: 'sp.access-control-delegations:loadingPermissions',
    defaultMessage: 'Sæki réttindi...',
  },
  errorLoadingPermissions: {
    id: 'sp.access-control-delegations:errorLoadingPermissions',
    defaultMessage: 'Ekki tókst að sækja réttindi',
  },
  noPermissionsAvailable: {
    id: 'sp.access-control-delegations:noPermissionsAvailable',
    defaultMessage: 'Engin réttindi í boði',
  },
  accessControlDelegationsIncoming: {
    id: 'sp.access-control-delegations:to-me',
    defaultMessage: 'Til mín',
  },
  accessControlDelegationsOutgoing: {
    id: 'sp.access-control-delegations:from-me',
    defaultMessage: 'Frá mér',
  },
  accessControlAccess: {
    id: 'sp.access-control-delegations:accessControlAccess',
    defaultMessage: 'Aðgangur',
  },
  allDomains: {
    id: 'sp.access-control-delegations:all-domains',
    defaultMessage: 'Öll kerfi',
  },
  domain: {
    id: 'sp.access-control-delegations:domain',
    defaultMessage: 'Kerfi',
  },
  chooseDomain: {
    id: 'sp.access-control-delegations:choose-domain',
    defaultMessage: 'Veldu kerfi',
  },
  expired: {
    id: 'sp.access-control-delegations:expired',
    defaultMessage: 'Útrunnið',
  },
  variableValidity: {
    id: 'sp.access-control-delegations:home-view-varies',
    defaultMessage: 'Breytilegur',
  },
  validityPeriod: {
    id: 'sp.access-control-delegations:validity-period',
    defaultMessage: 'Gildistími',
  },
  sameValidityPeriod: {
    id: 'sp.access-control-delegations:same-validity-period',
    defaultMessage: 'Sami gildistími fyrir öll réttindi',
  },
  delegationInSystem: {
    id: 'sp.access-control-delegations:delegation-in-system',
    defaultMessage: 'Umboð í kerfi',
  },
  accessHolder: {
    id: 'sp.access-control-delegations:access-holder',
    defaultMessage: 'Aðgangshafi',
  },
  accessOwner: {
    id: 'sp.access-control-delegations:delegation-to',
    defaultMessage: 'Aðgangsveitandi',
  },
  createdBy: {
    id: 'sp.access-control-delegations:created-by',
    defaultMessage: 'Skráð af',
  },
  accessScopes: {
    id: 'sp.access-control-delegations:access-title',
    defaultMessage: 'Réttindi',
  },
  selectedScopesWithValidityPeriod: {
    id: 'sp.access-control-delegations:selected-scopes-with-validity-period',
    defaultMessage: 'Umboð sem eru valin ásamt gildistíma',
  },
  accessScopesIntro: {
    id: 'sp.access-control-delegations:access-intro',
    defaultMessage:
      'Reyndu að lágmarka þau réttindi sem þú vilt veita viðkomandi eins mikið og mögulegt er.',
  },
  accessPeriod: {
    id: 'sp.access-control-delegations:access-period',
    defaultMessage: 'Gildistími',
  },
  accessConfirmModalTitle: {
    id: 'sp.access-control-delegations:access-confirm-modal-title',
    defaultMessage: 'Þú ert að veita aðgang',
  },
  confirmError: {
    id: 'sp.access-control-delegations:confirm-error',
    defaultMessage:
      'Ekki tókst að vista réttindi. Vinsamlegast reyndu aftur síðar',
  },
  deleteAccess: {
    id: 'sp.access-control-delegations:delete-access',
    defaultMessage: 'Eyða aðgangi',
  },
  accessRemoveModalTitle: {
    id: 'sp.access-control-delegations:access-remove-modal-content',
    defaultMessage: 'Ertu viss um að þú viljir eyða þessum aðgangi?',
  },
  deleteSuccess: {
    id: 'sp.access-control-delegations:delete-success',
    defaultMessage: 'Aðgangi eytt',
  },
  deleteError: {
    id: 'sp.access-control-delegations:delete-error',
    defaultMessage:
      'Ekki tókst að eyða umboði. Vinsamlegast reyndu aftur síðar',
  },
  deleteDelegationsFailed: {
    id: 'sp.access-control-delegations:delete-delegations-failed',
    defaultMessage: 'Ekki tókst að eyða eftirfarandi umboðum: {delegations}',
  },
  dateError: {
    id: 'sp.access-control-delegations:date-error',
    defaultMessage: 'Nauðsynlegt er að velja dagsetningu fyrir hvert umboð',
  },
  newAccess: {
    id: 'sp.access-control-delegations:new-delegation',
    defaultMessage: 'Nýtt umboð',
  },
  grantDelegation: {
    id: 'sp.access-control-delegations:grant-delegation',
    defaultMessage: 'Veita umboð',
  },
  accessControlIntro: {
    id: 'sp.access-control-delegations:header-intro-individual',
    defaultMessage:
      'Hérna getur þú veitt öðrum umboð og skoðað umboð sem aðrir hafa veitt þér. Þú getur eytt umboðum eða bætt við nýjum.',
  },
  accessControlIntroOnlyOutgoing: {
    id: 'sp.access-control-delegations:header-intro-only-outgoing',
    defaultMessage:
      'Hérna kemur listi yfir þau umboð sem þú hefur gefið öðrum. Þú getur eytt umboðum eða bætt við nýjum.',
  },
  saveAccess: {
    id: 'sp.access-control-delegations:empty-new-access',
    defaultMessage: 'Veita aðgang',
  },
  permission: {
    id: 'sp.access-control-delegations:access-explanation',
    defaultMessage: 'Heimild',
  },
  category: {
    id: 'sp.access-control-delegations:access-access',
    defaultMessage: 'Flokkur',
  },
  grantTitle: {
    id: 'sp.access-control-delegations:grant-title',
    defaultMessage: 'Veita aðgang',
  },
  grantIntro: {
    id: 'sp.access-control-delegations:grant-intro',
    defaultMessage:
      'Hér getur þú gefið öðrum aðgang til að sýsla með þín gögn hjá island.is',
  },
  grantFormAccessHolder: {
    id: 'sp.access-control-delegations:grant-form-access-holder',
    defaultMessage: 'Kennitala aðgangshafa',
  },
  grantIdentityError: {
    id: 'sp.access-control-delegations:grant-identity-error',
    defaultMessage: 'Enginn notandi fannst með þessa kennitölu.',
  },
  grantCreateError: {
    id: 'sp.access-control-delegations:grant-create-error',
    defaultMessage: 'Ekki tókst að búa til aðgang fyrir þennan notanda.',
  },
  grantDeceasedTitle: {
    id: 'sp.access-control-delegations:grant-deceased-title',
    defaultMessage: 'Ekki er hægt að stofna umboð',
  },
  grantDeceasedMessage: {
    id: 'sp.access-control-delegations:grant-deceased-message',
    defaultMessage: 'Ekki er hægt að veita umboð til látins einstaklings.',
  },
  grantRequiredSsn: {
    id: 'sp.access-control-delegations:grant-required-ssn',
    defaultMessage: 'Þú þarft að setja inn kennitölu',
  },
  grantInvalidSsn: {
    id: 'sp.access-control-delegations:grant-invalid-ssn',
    defaultMessage: 'Kennitalan er ekki gild kennitala',
  },
  grantSameSsn: {
    id: 'sp.access-control-delegations:grant-same-ssn',
    defaultMessage: 'Ekki má veita sjálfum sér umboð',
  },
  grantActorSsn: {
    id: 'sp.access-control-delegations:grant-actor-ssn',
    defaultMessage: 'Sem umboðshafi má ekki veita sjálfum sér umboð',
  },
  grantCompanySsn: {
    id: 'sp.access-control-delegations:grant-company-ssn',
    defaultMessage: 'Ekki má veita fyrirtækjum umboð',
  },
  grantRequiredDomain: {
    id: 'sp.access-control-delegations:grant-required-domain',
    defaultMessage: 'Skylda er að velja aðgangsstýringu',
  },
  grantNextStepDescription: {
    id: 'sp.access-control-delegations:next-step-description',
    defaultMessage:
      'Í næsta skrefi velurðu hvaða gögn viðkomandi getur skoðað eða sýslað með.',
  },
  grantChoosePermissions: {
    id: 'sp.access-control-delegations:choose-access-rights',
    defaultMessage: 'Velja réttindi',
  },
  grantChoosePeriod: {
    id: 'sp.access-control-delegations:choose-period',
    defaultMessage: 'Velja gildistíma umboðs',
  },
  grantAddMorePeople: {
    id: 'sp.access-control-delegations:grant-add-more-people',
    defaultMessage: 'Bæta við fleiri einstaklingum',
  },
  grantRemovePerson: {
    id: 'sp.access-control-delegations:grant-remove-person',
    defaultMessage: 'Fjarlægja',
  },
  closeModal: {
    id: 'sp.access-control-delegations:close-modal',
    defaultMessage: 'Loka glugga',
  },
  validTo: {
    id: 'sp.access-control-delegations:access-valid-to',
    defaultMessage: 'Í gildi til',
  },
  noValidToDate: {
    id: 'sp.access-control-delegations:no-valid-to-date',
    defaultMessage: 'Gildistími óendanlegur',
  },
  referenceId: {
    id: 'sp.access-control-delegations:reference-id',
    defaultMessage: 'Númer máls í Zendesk',
  },
  accessCreationSuccess: {
    id: 'sp.access-control-delegations:access-creation-success',
    defaultMessage: 'Umboð stofnað',
  },
  viewDelegationModalTitle: {
    id: 'sp.access-control-delegations:view-delegation-modal-title',
    defaultMessage: 'Upplýsingar um umboð',
  },
  // New delegation grant flow
  grantAccessNewTitle: {
    id: 'sp.access-control-delegations:grant-access-new-title',
    defaultMessage: 'Veita umboð',
  },
  editAccessTitle: {
    id: 'sp.access-control-delegations:edit-access-title',
    defaultMessage: 'Breyta umboði',
  },
  chooseRecipientsTitle: {
    id: 'sp.access-control-delegations:choose-recipients-title',
    defaultMessage: 'Hver á að fá umboðið?',
  },
  chooseRecipientsLabel: {
    id: 'sp.access-control-delegations:choose-recipients-label',
    defaultMessage: 'Velja umboðsaðila',
  },
  choosePermmissionsButtonLabel: {
    id: 'sp.access-control-delegations:choose-permissions-button-label',
    defaultMessage: 'Velja umboð til að veita',
  },
  choosePermissionsTitle: {
    id: 'sp.access-control-delegations:choose-permissions-title',
    defaultMessage: 'Hvaða réttindi viltu veita viðkomandi?',
  },
  choosePermissionsLabel: {
    id: 'sp.access-control-delegations:choose-permissions-label',
    defaultMessage: 'Velja réttindi',
  },
  choosePeriodButtonLabel: {
    id: 'sp.access-control-delegations:choose-period-button-label',
    defaultMessage: 'Velja gildistíma',
  },
  chooseRecipientsButtonLabel: {
    id: 'sp.access-control-delegations:choose-recipients-button-label',
    defaultMessage: 'Velja umboðsaðila',
  },
  choosePeriodTitle: {
    id: 'sp.access-control-delegations:choose-period-title',
    defaultMessage: 'Hversu lengi á umboðið að gilda?',
  },
  choosePeriodLabel: {
    id: 'sp.access-control-delegations:choose-period-label',
    defaultMessage: 'Velja gildistíma',
  },
  confirmAccessButtonLabel: {
    id: 'sp.access-control-delegations:confirm-access-button-label',
    defaultMessage: 'Staðfesta skráningu umboðs',
  },
  deleteWarningStepLabel: {
    id: 'sp.access-control-delegations:delete-warning-step-label',
    defaultMessage: 'Eyða umboði',
  },
  continueStepLabel: {
    id: 'sp.access-control-delegations:continue-step-label',
    defaultMessage: 'Halda áfram',
  },
  deleteWarningTitle: {
    id: 'sp.access-control-delegations:title-delete-warning',
    defaultMessage: 'Viltu eyða umboðinu?',
  },
  deleteWarningBody: {
    id: 'sp.access-control-delegations:delete-warning-body',
    defaultMessage: 'Ef öll réttindi eru fjarlægð verður umboðinu eytt.',
  },
  deleteWarningButton: {
    id: 'sp.access-control-delegations:delete-warning-button',
    defaultMessage: 'Eyða umboði',
  },
  confirmAccessModalTitle: {
    id: 'sp.access-control-delegations:confirm-access-modal-title',
    defaultMessage: 'Staðfesta veitingu á nýju umboði',
  },
  confirmEditAccessModalTitle: {
    id: 'sp.access-control-delegations:confirm-edit-access-modal-title',
    defaultMessage: 'Staðfesta breytingar á umboði',
  },
  searchScopesPlaceholder: {
    id: 'sp.access-control-delegations:search-scopes-placeholder',
    defaultMessage: 'Leita að umboði',
  },
  filterClearAll: {
    id: 'sp.access-control-delegations:filter-clear-all',
    defaultMessage: 'Hreinsa allar síur',
  },
  filterClear: {
    id: 'sp.access-control-delegations:filter-clear',
    defaultMessage: 'Hreinsa síu',
  },
  filterTags: {
    id: 'sp.access-control-delegations:filter-tags',
    defaultMessage: 'Tags',
  },
  filterDomains: {
    id: 'sp.access-control-delegations:filter-domains',
    defaultMessage: 'Stofnanir',
  },
  filterOpen: {
    id: 'sp.access-control-delegations:filter-open',
    defaultMessage: 'Opna síu',
  },
  grantAccessStepsTitle: {
    id: 'sp.access-control-delegations:grant-access-scopes-title',
    defaultMessage: 'Veita nýtt umboð',
  },
  grantAccessStepsIntro: {
    id: 'sp.access-control-delegations:grant-access-scopes-intro',
    defaultMessage:
      'Hérna getur þú, í þremur skrefum, veitt einstaklingum umboð til að sinna þínum erindum á vefsvæðum opinberra stofnana',
  },
  editAccessStepsTitle: {
    id: 'sp.access-control-delegations:edit-access-steps-title',
    defaultMessage: 'Breyta umboði',
  },
  editAccessStepsIntro: {
    id: 'sp.access-control-delegations:edit-access-steps-intro',
    defaultMessage:
      'Hérna getur þú bætt við umboðum, fjarlægt eða breytt gildistíma.',
  },
  accessPeriodSame: {
    id: 'sp.access-control-delegations:access-period-same',
    defaultMessage: 'Ég vil hafa sama gildistíma á öllum umboðum',
  },
  accessPeriodDifferent: {
    id: 'sp.access-control-delegations:access-period-different',
    defaultMessage: 'Ég vil hafa mismunandi gildistíma fyrir mismunandi umboð',
  },
  scopeValidityPeriodUpdated: {
    id: 'sp.access-control-delegations:scope-validity-period-updated',
    defaultMessage: 'Gildistími umboðs uppfærður',
  },

  nationalId: {
    id: 'sp.access-control-delegations:national-id',
    defaultMessage: 'Kennitala',
  },
  delegationNr: {
    id: 'sp.access-control-delegations:delegation-nr',
    defaultMessage: 'Umboð {index}',
  },
  backButton: {
    id: 'sp.access-control-delegations:back-button',
    defaultMessage: 'Til baka',
  },

  // Table messages
  name: {
    id: 'sp.access-control-delegations:name',
    defaultMessage: 'Nafn',
  },
  numberOfDelegations: {
    id: 'sp.access-control-delegations:number-of-delegations',
    defaultMessage: 'Fjöldi umboða',
  },
  totalRights: {
    id: 'sp.access-control-delegations:total-rights',
    defaultMessage: 'Heildarfjöldi réttinda',
  },
  domains: {
    id: 'sp.access-control-delegations:domains',
    defaultMessage: 'Lén',
  },
  scopeDisplayName: {
    id: 'sp.access-control-delegations:scope-display-name',
    defaultMessage: 'Heiti réttinda',
  },
  validFrom: {
    id: 'sp.access-control-delegations:valid-from',
    defaultMessage: 'Gildir frá',
  },
  noDelegations: {
    id: 'sp.access-control-delegations:no-delegations',
    defaultMessage: 'Engin umboð fundust',
  },
  switch: {
    id: 'sp.access-control-delegations:switch',
    defaultMessage: 'Skipta',
  },
  procurationHolder: {
    id: 'sp.access-control-delegations:procuration-holder',
    defaultMessage: 'Prókúruhafi',
  },
  legalGuardian: {
    id: 'sp.access-control-delegations:legal-guardian',
    defaultMessage: 'Forsjá barns 16-19 ára',
  },
  legalGuardianMinor: {
    id: 'sp.access-control-delegations:legal-guardian-minor',
    defaultMessage: 'Forsjá barns 0-15 ára',
  },
  legalGuardianTableTitle: {
    id: 'sp.access-control-delegations:legal-guardian-table-title',
    defaultMessage: 'Börn í þinni forsjá',
  },
  procurationHolderTableTitle: {
    id: 'sp.access-control-delegations:procuration-holder-table-title',
    defaultMessage: 'Fyrirtæki þar sem þú ert prókúruhafi',
  },
  registry: {
    id: 'sp.access-control-delegations:registry',
    defaultMessage: 'Þjóðskrá',
  },
  revenueAndCustoms: {
    id: 'sp.access-control-delegations:revenue-and-customs',
    defaultMessage: 'Skatturinn',
  },
  read: {
    id: 'sp.access-control-delegations:read',
    defaultMessage: 'Skoða',
  },
  readAndWrite: {
    id: 'sp.access-control-delegations:read-and-write',
    defaultMessage: 'Skoða og breyta',
  },
  headerName: {
    id: 'sp.access-control-delegations:header-name',
    defaultMessage: 'Nafn',
  },
  headerCompanyName: {
    id: 'sp.access-control-delegations:header-company-name',
    defaultMessage: 'Heiti',
  },
  headerDomain: {
    id: 'sp.access-control-delegations:header-domain',
    defaultMessage: 'Stofnun',
  },
  headerDelegationType: {
    id: 'sp.access-control-delegations:header-delegation-type',
    defaultMessage: 'Tegund umboðs',
  },
  headerValidityPeriod: {
    id: 'sp.access-control-delegations:header-validity-period',
    defaultMessage: 'Gildistími',
  },
  headerRegisteredDate: {
    id: 'sp.access-control-delegations:header-registered-date',
    defaultMessage: 'Skráð dags.',
  },
  headerScopeName: {
    id: 'sp.access-control-delegations:header-scope-name',
    defaultMessage: 'Heiti umboðs',
  },
  headerDescription: {
    id: 'sp.access-control-delegations:header-description',
    defaultMessage: 'Lýsing á umboði',
  },
  headerPermissionType: {
    id: 'sp.access-control-delegations:header-permission-type',
    defaultMessage: 'Tegund réttinda',
  },
  selectAll: {
    id: 'sp.access-control-delegations:select-all',
    defaultMessage: 'Velja allt',
  },
  noDelegationsFound: {
    id: 'sp.access-control-delegations:no-delegations-found',
    defaultMessage: 'Engin rafræn umboð fundust',
  },

  // Request a delegation ("Beiðni um umboð")
  requestDelegationNavTitle: {
    id: 'sp.access-control-delegations:request-delegation-nav-title',
    defaultMessage: 'Biðja um nýtt umboð',
  },
  requestDelegationTitle: {
    id: 'sp.access-control-delegations:request-delegation-title',
    defaultMessage: 'Biðja um umboð',
  },
  requestDelegationIntro: {
    id: 'sp.access-control-delegations:request-delegation-intro',
    defaultMessage:
      'Hérna getur þú beðið einstakling eða fyrirtæki um umboð til að sinna erindum fyrir þeirra hönd á Ísland.is.',
  },
  requestChooseGranterTitle: {
    id: 'sp.access-control-delegations:request-choose-granter-title',
    defaultMessage: 'Hvern viltu biðja um umboð?',
  },
  requestChooseGranterLabel: {
    id: 'sp.access-control-delegations:request-choose-granter-label',
    defaultMessage: 'Velja umboðsveitanda',
  },
  requestGranterNationalIdLabel: {
    id: 'sp.access-control-delegations:request-granter-national-id-label',
    defaultMessage: 'Kennitala umboðsveitanda',
  },
  requestSameSsnError: {
    id: 'sp.access-control-delegations:request-same-ssn-error',
    defaultMessage: 'Ekki er hægt að biðja sjálfan sig um umboð',
  },
  requestChooseScopesTitle: {
    id: 'sp.access-control-delegations:request-choose-scopes-title',
    defaultMessage: 'Hvaða réttindi viltu biðja um?',
  },
  requestChooseGranterButtonLabel: {
    id: 'sp.access-control-delegations:request-choose-granter-button-label',
    defaultMessage: 'Velja réttindi',
  },
  requestChooseScopesButtonLabel: {
    id: 'sp.access-control-delegations:request-choose-scopes-button-label',
    defaultMessage: 'Skrá tengsl og tilgang',
  },
  requestDetailsTitle: {
    id: 'sp.access-control-delegations:request-details-title',
    defaultMessage: 'Tengsl og tilgangur',
  },
  requestRelationshipLabel: {
    id: 'sp.access-control-delegations:request-relationship-label',
    defaultMessage: 'Tengsl þín við umboðsveitanda',
  },
  requestRelationshipPlaceholder: {
    id: 'sp.access-control-delegations:request-relationship-placeholder',
    defaultMessage: 'Lýstu tengslum þínum við umboðsveitanda',
  },
  requestRelationshipRequired: {
    id: 'sp.access-control-delegations:request-relationship-required',
    defaultMessage: 'Nauðsynlegt er að skrá tengsl',
  },
  requestReasonLabel: {
    id: 'sp.access-control-delegations:request-reason-label',
    defaultMessage: 'Tilgangur umboðsins',
  },
  requestReasonPlaceholder: {
    id: 'sp.access-control-delegations:request-reason-placeholder',
    defaultMessage: 'Lýstu því af hverju þú biður um umboðið',
  },
  requestReasonRequired: {
    id: 'sp.access-control-delegations:request-reason-required',
    defaultMessage: 'Nauðsynlegt er að skrá tilgang',
  },
  requestDetailsButtonLabel: {
    id: 'sp.access-control-delegations:request-details-button-label',
    defaultMessage: 'Yfirlit',
  },
  requestConfirmButtonLabel: {
    id: 'sp.access-control-delegations:request-confirm-button-label',
    defaultMessage: 'Senda beiðni',
  },
  requestConfirmTitle: {
    id: 'sp.access-control-delegations:request-confirm-title',
    defaultMessage: 'Yfirfarðu beiðnina',
  },
  requestSuccess: {
    id: 'sp.access-control-delegations:request-success',
    defaultMessage: 'Beiðni um umboð hefur verið send',
  },
  requestError: {
    id: 'sp.access-control-delegations:request-error',
    defaultMessage:
      'Ekki tókst að senda beiðni um umboð. Vinsamlegast reyndu aftur síðar.',
  },
  requestTooManyPendingError: {
    id: 'sp.access-control-delegations:request-too-many-pending-error',
    defaultMessage:
      'Þú ert með of margar opnar beiðnir. Afturkallaðu beiðni eða bíddu eftir svari áður en þú sendir nýja.',
  },
  requestBlockedError: {
    id: 'sp.access-control-delegations:request-blocked-error',
    defaultMessage:
      'Ekki er hægt að senda beiðni um umboð. Lokað hefur verið á nýjar beiðnir vegna ítrekaðra hafnana.',
  },
  requestRelationshipHeader: {
    id: 'sp.access-control-delegations:request-relationship-header',
    defaultMessage: 'Tengsl',
  },
  requestReasonHeader: {
    id: 'sp.access-control-delegations:request-reason-header',
    defaultMessage: 'Tilgangur',
  },

  // Incoming requests (grantor side)
  incomingRequestsHeader: {
    id: 'sp.access-control-delegations:incoming-requests-header',
    defaultMessage: 'Beiðnir um umboð',
  },
  incomingRequestsTitle: {
    id: 'sp.access-control-delegations:incoming-requests-title',
    defaultMessage: 'Beiðnir sem bíða svara',
  },
  requestFrom: {
    id: 'sp.access-control-delegations:request-from',
    defaultMessage: 'Sendandi beiðni',
  },
  requestApprove: {
    id: 'sp.access-control-delegations:request-approve',
    defaultMessage: 'Samþykkja',
  },
  requestReviewButton: {
    id: 'sp.access-control-delegations:request-review-button',
    defaultMessage: 'Skoða',
  },
  requestReviewTitle: {
    id: 'sp.access-control-delegations:request-review-title',
    defaultMessage: 'Beiðni um umboð',
  },
  requestExpiresAt: {
    id: 'sp.access-control-delegations:request-expires-at',
    defaultMessage: 'Beiðnin fellur úr gildi',
  },
  requestReject: {
    id: 'sp.access-control-delegations:request-reject',
    defaultMessage: 'Hafna',
  },
  requestRejectSuccess: {
    id: 'sp.access-control-delegations:request-reject-success',
    defaultMessage: 'Beiðni hafnað',
  },
  requestRejectConfirmTitle: {
    id: 'sp.access-control-delegations:request-reject-confirm-title',
    defaultMessage: 'Hafna beiðni um umboð',
  },
  requestRejectConfirmText: {
    id: 'sp.access-control-delegations:request-reject-confirm-text',
    defaultMessage: 'Ertu viss um að þú viljir hafna beiðni frá {name}?',
  },
  requestRejectConfirmTracking: {
    id: 'sp.access-control-delegations:request-reject-confirm-tracking',
    defaultMessage:
      'Hafnanir eru skráðar. Aðili sem fær ítrekaðar hafnanir verður tilkynntur og lokað verður á frekari beiðnir frá viðkomandi.',
  },
  requestRejectConfirmButton: {
    id: 'sp.access-control-delegations:request-reject-confirm-button',
    defaultMessage: 'Hafna beiðni',
  },
  requestRejectError: {
    id: 'sp.access-control-delegations:request-reject-error',
    defaultMessage: 'Ekki tókst að hafna beiðni. Vinsamlegast reyndu aftur.',
  },
  requestScopesNotGrantable: {
    id: 'sp.access-control-delegations:request-scopes-not-grantable',
    defaultMessage:
      'Eftirfarandi umbeðin réttindi er ekki hægt að veita: {scopes}',
  },

  // Outgoing requests (requester side)
  outgoingRequestsHeader: {
    id: 'sp.access-control-delegations:outgoing-requests-header',
    defaultMessage: 'Beiðnir sem þú hefur sent',
  },
  outgoingRequestsTitle: {
    id: 'sp.access-control-delegations:outgoing-requests-title',
    defaultMessage: 'Sendar beiðnir um umboð',
  },
  requestTo: {
    id: 'sp.access-control-delegations:request-to',
    defaultMessage: 'Umboðsveitandi',
  },
  requestStatus: {
    id: 'sp.access-control-delegations:request-status',
    defaultMessage: 'Staða',
  },
  requestDateSent: {
    id: 'sp.access-control-delegations:request-date-sent',
    defaultMessage: 'Sent dags',
  },
  requestScopeCount: {
    id: 'sp.access-control-delegations:request-scope-count',
    defaultMessage: 'Fjöldi réttinda',
  },
  requestCancel: {
    id: 'sp.access-control-delegations:request-cancel',
    defaultMessage: 'Afturkalla',
  },
  requestCancelSuccess: {
    id: 'sp.access-control-delegations:request-cancel-success',
    defaultMessage: 'Beiðni afturkölluð',
  },
  requestCancelError: {
    id: 'sp.access-control-delegations:request-cancel-error',
    defaultMessage:
      'Ekki tókst að afturkalla beiðni. Vinsamlegast reyndu aftur.',
  },
  requestStatusPending: {
    id: 'sp.access-control-delegations:request-status-pending',
    defaultMessage: 'Bíður svars',
  },
  requestStatusApproved: {
    id: 'sp.access-control-delegations:request-status-approved',
    defaultMessage: 'Samþykkt',
  },
  requestStatusRejected: {
    id: 'sp.access-control-delegations:request-status-rejected',
    defaultMessage: 'Hafnað',
  },
  requestStatusCancelled: {
    id: 'sp.access-control-delegations:request-status-cancelled',
    defaultMessage: 'Afturkölluð',
  },
  requestStatusExpired: {
    id: 'sp.access-control-delegations:request-status-expired',
    defaultMessage: 'Útrunnin',
  },
})
