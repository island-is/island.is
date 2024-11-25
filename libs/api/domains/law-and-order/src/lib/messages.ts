import { defineMessages } from 'react-intl'

export const m = defineMessages({
  summon: {
    id: 'api.law-and-order:summon',
    defaultMessage: 'Fyrirkall',
  },
  seeSummon: {
    id: 'api.law-and-order:see-summon',
    defaultMessage: 'Sjá fyrirkall',
  },
  seeSummonInMailbox: {
    id: 'api.law-and-order:see-summon-in-mailbox',
    defaultMessage: 'Sjá fyrirkall í pósthólfi',
  },
  mailboxLink: {
    id: 'api.law-and-order:mailbox-link',
    defaultMessage: '/postholf',
  },
  summonLink: {
    id: 'api.law-and-order:summon-link',
    defaultMessage: `/log-og-reglur/domsmal/{caseId}/fyrirkall`,
  },
  waiveMessage: {
    id: 'api.law-and-order:no-defender',
    defaultMessage: 'Ég óska ekki eftir verjanda',
  },
  chooseMessage: {
    id: 'api.law-and-order:choosing-lawyer',
    defaultMessage:
      'Ég óska þess að valinn lögmaður verði skipaður verjandi minn',
  },
  delayMessage: {
    id: 'api.law-and-order:delay-choice',
    defaultMessage:
      'Ég óska eftir fresti fram að þingfestingu til þess að tilnefna verjanda',
  },
  delegateMessage: {
    id: 'api.law-and-order:choose-for-me',
    defaultMessage: 'Ég fel dómara málsins að tilnefna og skipa mér verjanda',
  },
})
