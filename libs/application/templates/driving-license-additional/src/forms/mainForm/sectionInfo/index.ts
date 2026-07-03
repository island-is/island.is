import { buildSection } from '@island.is/application/core'
import { subSectionQualityPhotoBE } from './subSectionQualityPhotoBE'
import { subSectionDelivery } from './subSectionDelivery'
import { subSectionHealthDeclaration } from './subSectionHealthDeclaration'
import { m } from '../../../lib/messages'
import { subSectionApplicantInfo } from './subSectionApplicantInfo'

export const sectionInfo = buildSection({
  id: 'info',
  title: m.informationTitle,
  children: [
    subSectionApplicantInfo,
    subSectionQualityPhotoBE,
    subSectionDelivery,
    subSectionHealthDeclaration,
  ],
})
