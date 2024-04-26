import { buildSection } from '@island.is/application/core'
import { personal } from '../../../lib/messages'
import { UserInformationSubSection } from './UserInformationSubSection'
import { PickChildrenSubSection } from './PickChildrenSubSection'
import { PickChildrenExtraSubSection } from './PickedChildrenExtraSubSection'

export const PersonalSection = buildSection({
  id: 'personal',
  title: personal.general.sectionTitle,
  children: [
    UserInformationSubSection,
    PickChildrenSubSection,
    PickChildrenExtraSubSection,
  ],
})
