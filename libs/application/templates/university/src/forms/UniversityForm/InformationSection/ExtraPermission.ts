import { buildSubSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const ExtraPermissionSubSection = buildSubSection({
  id: 'ExtraPermission',
  title: information.labels.extraPermission.sectionTitle,
  children: [],
})
