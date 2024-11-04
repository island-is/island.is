import { AirDiscountSchemeFlightLegState as States } from '@island.is/api/schema'
import { Airlines } from '@island.is/air-discount-scheme/consts'

export const financialStateOptions = [
  {
    value: States.AWAITING_DEBIT,
    label: 'Á eftir að gjaldfæra',
  },
  { value: States.SENT_DEBIT, label: 'Gjaldfært' },
  {
    value: States.AWAITING_CREDIT,
    label: 'Á eftir að endurgreiða',
  },
  { value: States.SENT_CREDIT, label: 'Endurgreitt' },
  { value: States.CANCELLED, label: 'Afturkallað' },
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
    label: 'Mýflug',
    value: Airlines.myflug,
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
    label: 'x',
    value: 'x',
  },
]
