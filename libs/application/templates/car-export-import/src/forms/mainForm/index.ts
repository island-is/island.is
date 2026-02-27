import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { registrationTypeSection } from './registrationType'
import { exportVehiclesSection } from './exportVehicles'
import { importVehiclesSection } from './importVehicles'
import { overviewSection } from './overview'
import { importDatesAndMileageSection } from './importDatesAndMileageSection'
import { exportDatesAndMileageSection } from './exportDatesAndMileageSection'

const exportApplicationPath = [
  exportVehiclesSection,
  exportDatesAndMileageSection,
]

const importApplicationPath = [
  importVehiclesSection,
  importDatesAndMileageSection,
]

export const MainForm = buildForm({
  id: 'MainForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    registrationTypeSection,
    ...exportApplicationPath,
    ...importApplicationPath,
    overviewSection,
  ],
})
