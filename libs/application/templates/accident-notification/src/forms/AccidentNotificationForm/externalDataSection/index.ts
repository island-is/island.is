import { buildSection } from '@island.is/application/core'
import { agreementDescriptionScreen } from './agreementDescriptionScreen'
import { accidentNotificationScreen } from './accidentNotificationScreen'

export const externalDataSection = buildSection({
  id: 'ExternalDataSection',
  title: 'Meðferð á gögnum',
  children: [agreementDescriptionScreen, accidentNotificationScreen],
})
