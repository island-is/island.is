import { defineMessages } from 'react-intl'

export const m = defineMessages({
  chooseDelegation: {
    id: 'service.portal:choose-tabs',
    defaultMessage: 'Veldu umboð',
    description: 'Choose delegation',
  },
  delegationTypeCustom: {
    id: 'service.portal:delegation-type-custom',
    defaultMessage: 'Umboð',
  },
  delegationTypeLegalGuardian: {
    id: 'service.portal:delegation-type-legal-guardian',
    defaultMessage: 'Forsjá',
  },
  delegationTypeProcurationHolder: {
    id: 'service.portal:delegation-type-procuration-holder',
    defaultMessage: 'Prókúra',
  },
  delegationTypePersonalRepresentative: {
    id: 'service.portal:delegation-type-personal-representative',
    defaultMessage: 'Pers. talsmaður',
  },
  delegationTypeCustomDesc: {
    id: 'service.portal:delegation-type-custom',
    defaultMessage: 'Umboð sem eru veitt í aðgangstýringarkerfi Ísland.is',
  },
  delegationTypeLegalGuardianDesc: {
    id: 'service.portal:delegation-type-legal-guardian',
    defaultMessage: 'Eru sótt úr forsjárskrá Þjóðskrár',
  },
  delegationTypeProcurationHolderDesc: {
    id: 'service.portal:delegation-type-procuration-holder',
    defaultMessage: 'Eru sótt úr fyrirtækjaskrá Skattsins',
  },
  delegationTypePersonalRepresentativeDesc: {
    id: 'service.portal:delegation-type-personal-representative',
    defaultMessage: 'Samningar frá Réttindagæslu fatlaðra',
  },
})
