import { buildSection } from '@island.is/application/core'
import { agreementDescriptionMultiField } from './agreementDescriptionMultiField'
import { accidentNotificationSubSection } from './accidentNotificationSubSection'

export const externalDataSection = buildSection({
  id: 'ExternalDataSection',
  title: 'Meðferð á gögnum',
  children: [agreementDescriptionMultiField, accidentNotificationSubSection],
})
