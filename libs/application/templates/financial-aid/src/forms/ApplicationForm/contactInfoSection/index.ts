import { buildSection } from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import { contactInfoMultiField } from './contactInfoMultiField'

export const contactInfoSection = buildSection({
  id: Routes.CONTACTINFO,
  title: m.contactInfo.general.sectionTitle,
  children: [contactInfoMultiField],
})
