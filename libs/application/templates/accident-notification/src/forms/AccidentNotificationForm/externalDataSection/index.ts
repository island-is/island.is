import { buildSection } from '@island.is/application/core'
import { agreementDescriptionMultiField } from './agreementDescriptionMultiField'
import { accidentNotificationSubSection } from './accidentNotificationSubSection'
import { externalData } from '../../../lib/messages'

export const externalDataSection = buildSection({
  id: 'ExternalDataSection',
  title: externalData.agreementDescription.listTitle,
  children: [agreementDescriptionMultiField, accidentNotificationSubSection],
})
