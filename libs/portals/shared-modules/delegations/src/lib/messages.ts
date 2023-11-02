import { defineMessages } from 'react-intl'

export const m = defineMessages({
  chooseDelegation: {
    id: 'sp.access-control-delegations:choose-tabs',
    defaultMessage: 'Veldu umboð',
    description: 'Choose delegation',
  },
  noDelegations: {
    id: 'sp.access-control-delegations:empty',
    defaultMessage: 'Umboð sem þú hefur veitt öðrum munu birtast hér.',
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
  accessControl: {
    id: 'sp.access-control-delegations:accessControl',
    defaultMessage: 'Aðgangsstýring',
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
  accessCreationSuccess: {
    id: 'sp.access-control-delegations:access-creation-success',
    defaultMessage: 'Umboð stofnað',
  },
})
