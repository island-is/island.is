import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { registrationTypeSection } from './registrationType'
import { exportVehiclesSection } from './exportVehicles'
import { importVehiclesSection } from './importVehicles'
import { datesAndMileageSection } from './datesAndMileage'
import { overviewSection } from './overview'

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    registrationTypeSection,
    exportVehiclesSection,
    importVehiclesSection,
    datesAndMileageSection,
    overviewSection,
  ],
})
