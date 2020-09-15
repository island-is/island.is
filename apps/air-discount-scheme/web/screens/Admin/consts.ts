import { Airlines, States } from '@island.is/air-discount-scheme/consts'
import { FlightLegsInput } from '@island.is/air-discount-scheme/types'

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
    value: null,
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

export type FilterInput = FlightLegsInput & {
  airline: { value: string }
}
