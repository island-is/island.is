import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { vehicleSection } from './vehicleSection'
import { departureSection } from './departureSection'
import { overviewSection } from './overviewSection'

export const DepartureForm = buildForm({
  id: 'DepartureForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [vehicleSection, departureSection, overviewSection],
})
