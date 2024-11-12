import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages/information'
import { companySection } from './companySection'
import { workhealthSection } from './workhealth'
import { projectPurchaseSection } from './projectPurchase'

export const informationSection = buildSection({
  id: 'informationSection',
  title: information.general.pageTitle,
  children: [companySection, workhealthSection, projectPurchaseSection],
})
