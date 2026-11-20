import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { arrivalSection } from './arrivalSection'
import { proofOfTravelSection } from './proofOfTravelSection'
import { overviewSection } from './overviewSection'

export const ArrivalForm = buildForm({
  id: 'ArrivalForm',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  children: [arrivalSection, proofOfTravelSection, overviewSection],
})
