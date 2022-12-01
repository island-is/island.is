import { Airlines, States } from '@island.is/air-discount-scheme/consts'

export const financialStateOptions = [
  {
    value: States.awaitingDebit,
    label: 'Á eftir að gjaldfæra',
  },
  { value: States.sentDebit, label: 'Gjaldfært' },
  {
    value: States.awaitingCredit,
    label: 'Á eftir að endurgreiða',
  },
  { value: States.sentCredit, label: 'Endurgreitt' },
  { value: States.cancelled, label: 'Afturkallað' },
]

export const airlineOptions = [
  {
    label: 'Öll flugfélög',
    value: '',
  },
  {
    label: 'Ernir',
    value: Airlines.ernir,
  },
  {
    label: 'Icelandair',
    value: Airlines.icelandair,
  },
  {
    label: 'Norlandair',
    value: Airlines.norlandair,
  },
]

export const genderOptions = [
  {
    label: 'Öll kyn',
    value: '',
  },
  {
    label: 'kk',
    value: 'kk',
  },
  {
    label: 'kvk',
    value: 'kvk',
  },
  {
    label: 'hvk',
    value: 'hvk',
  },
]
