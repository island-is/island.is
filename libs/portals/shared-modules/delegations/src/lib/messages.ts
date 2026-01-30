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
  serviceCategories: {
    id: 'sp.access-control-delegations:serviceCategories',
    defaultMessage: 'Þjónustuflokkar',
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
  accessScopesIntro: {
    id: 'sp.access-control-delegations:access-intro',
    defaultMessage:
      'Reyndu að lágmarka þau réttindi sem þú vilt veita viðkomandi eins mikið og mögulegt er.',
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
  dateError: {
    id: 'sp.access-control-delegations:date-error',
    defaultMessage: 'Nauðsynlegt er að velja dagsetningu fyrir hvert umboð',
  },
  newAccess: {
    id: 'sp.access-control-delegations:new-delegation',
    defaultMessage: 'Nýtt umboð',
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
    defaultMessage: 'Beiðni um nýtt umboð',
  },
  grantAccessNewIntro: {
    id: 'sp.access-control-delegations:grant-access-new-intro',
    defaultMessage:
      'Hér getur þú, í þremur skrefum, beðið einstaklinga eða fyrirtæki um að veita þér ákvæðið umboð til að skoða vefsvæðum opinberum stofnunum á Ísland.is',
  },
  stepOneTitle: {
    id: 'sp.access-control-delegations:step-one-title',
    defaultMessage:
      '1. Hvaða einstaklingur eða fyrirtæki viltu biðja um umboð?',
  },
  stepTwoTitle: {
    id: 'sp.access-control-delegations:step-two-title',
    defaultMessage: '2. Hvaða umboð viltu biðja um?',
  },
  stepThreeTitle: {
    id: 'sp.access-control-delegations:step-three-title',
    defaultMessage: '3. Hversu lengi á afangareint umboð að gilda?',
  },
  grantAccessScopesIntro: {
    id: 'sp.access-control-delegations:grant-access-scopes-intro',
    defaultMessage:
      'Leita að umboði, nota síur til að þrengja leitina eða velja úr flokkum hér að neðan.',
  },
  searchScopesPlaceholder: {
    id: 'sp.access-control-delegations:search-scopes-placeholder',
    defaultMessage:
      'Leita eftir flokki, helium umboðs, heiti um stofnun eða lýsingu umbóðs...',
  },
  clearSearchAndFilters: {
    id: 'sp.access-control-delegations:clear-search-filters',
    defaultMessage: 'Hreinsa leit/síu',
  },
  filterByTag: {
    id: 'sp.access-control-delegations:filter-by-tag',
    defaultMessage: 'Sía:',
  },
  scopesSelected: {
    id: 'sp.access-control-delegations:scopes-selected',
    defaultMessage: 'umboð valin',
  },
  clearSelection: {
    id: 'sp.access-control-delegations:clear-selection',
    defaultMessage: 'Hreinsa val',
  },
  selectAll: {
    id: 'sp.access-control-delegations:select-all',
    defaultMessage: 'Velja allt',
  },
  deselectAll: {
    id: 'sp.access-control-delegations:deselect-all',
    defaultMessage: 'Afvelja allt',
  },
  sendDelegationRequest: {
    id: 'sp.access-control-delegations:send-delegation-request',
    defaultMessage: 'Senda beiðni um nýtt umboð',
  },
  noScopesMatchFilter: {
    id: 'sp.access-control-delegations:no-scopes-match-filter',
    defaultMessage: 'Engin umboð fundust með þessari leit eða síu',
  },
  showingResults: {
    id: 'sp.access-control-delegations:showing-results',
    defaultMessage: 'Sýni {count} af {total} umboðum',
  },
  grantValidityPeriod: {
    id: 'sp.access-control-delegations:grant-validity-period',
    defaultMessage: 'Gildistími sem óskað er eftir',
  },
  grantSelectDate: {
    id: 'sp.access-control-delegations:grant-select-date',
    defaultMessage: 'Veldu dagsetningu',
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
  switch: {
    id: 'sp.access-control-delegations:switch',
    defaultMessage: 'Skipta',
  },
  procurationHolder: {
    id: 'sp.access-control-delegations:procuration-holder',
    defaultMessage: 'Prókúruhafi',
  },
  generalMandate: {
    id: 'sp.access-control-delegations:general-mandate',
    defaultMessage: 'Allsherjarumboð',
  },
  legalGuardian: {
    id: 'sp.access-control-delegations:legal-guardian',
    defaultMessage: 'Forsjá barns 16-19 ára',
  },
  legalGuardianMinor: {
    id: 'sp.access-control-delegations:legal-guardian-minor',
    defaultMessage: 'Forsjá barns 0-15 ára',
  },
  registry: {
    id: 'sp.access-control-delegations:registry',
    defaultMessage: 'Þjóðskrá',
  },
})
