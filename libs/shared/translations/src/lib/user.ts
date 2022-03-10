import { defineMessages } from 'react-intl'

export const userMessages = defineMessages({
  userButtonAria: {
    id: 'global:userButtonAria',
    description: 'Lýsing á notendavalmynd fyrir skjálesara',
    defaultMessage: 'Útskráning og aðgangsstillingar',
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
