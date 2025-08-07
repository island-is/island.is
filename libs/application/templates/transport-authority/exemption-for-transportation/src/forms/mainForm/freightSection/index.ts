import { buildSection } from '@island.is/application/core'
import { freight } from '../../../lib/messages'
import { FreightShortTermCreateMultiField } from './freightShortTermCreate'
import { FreightLongTermCreateSubSection } from './freightLongTermCreate'
import { FreightLongTermPairingSubSections } from './freightLongTermPairing'

export const freightSection = buildSection({
  id: 'freightSection',
  title: freight.general.sectionTitle,
  children: [
    FreightShortTermCreateMultiField,
    FreightLongTermCreateSubSection,
    ...FreightLongTermPairingSubSections,
  ],
})
