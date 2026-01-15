import { defineMessages } from 'react-intl'

export const userMessages = defineMessages({
  userButtonAria: {
    id: 'global:userButtonAria',
    description: 'DEPRECATED - Lýsing á notendavalmynd fyrir skjálesara',
    defaultMessage: 'Útskráning og aðgangsstillingar fyrir {arg}',
  },
  userButtonAriaLabel: {
    id: 'global:userButtonAriaLabel',
    description: 'Lýsing á notendavalmynd fyrir skjálesara',
    defaultMessage: 'Útskráning og aðgangsstillingar fyrir {arg}',
  },
  userButtonDelegationAriaLabel: {
    id: 'global:userButtonDelegationAriaLabel',
    description: 'Lýsing á notendavalmynd fyrir skjálesara ef í umboði',
    defaultMessage:
      'Útskráning og aðgangsstillingar fyrir {arg} í umboði {delegationArg} ',
  },
  userButtonAriaModalLabel: {
    id: 'global:userButtonAriaModalLabel',
    description: 'Lýsing á notendavalmyndarmódal fyrir skjálesara',
    defaultMessage: 'Útskráning og aðgangsstillingar',
  },

  personalInformation: {
    id: 'global:personalInformation',
    defaultMessage: 'Mínar stillingar',
  },

  companyInformation: {
    id: 'global:companyInformation',
    defaultMessage: 'Stillingar',
  },

  backToMyself: {
    id: 'global:backToMyself',
    description: 'Takki til að skipta frá umboði til baka á raun notanda.',
    defaultMessage: 'Til baka á mínar síður',
  },

  delegationList: {
    id: 'global:userDelegationList',
    defaultMessage: `Aðgangar`,
  },

  switchUser: {
    id: 'global:switchUser',
    defaultMessage: `Skipta um notanda`,
  },

  delegationError: {
    id: 'global:userDelegationError',
    defaultMessage: `Tókst ekki að sækja aðgangslista.`,
  },

  selectedDelegation: {
    id: 'global:userDelegationSelected',
    description: 'Birtist í lista af umboðum við hlið þess sem er í notkun.',
    defaultMessage: `Valið`,
  },
})
