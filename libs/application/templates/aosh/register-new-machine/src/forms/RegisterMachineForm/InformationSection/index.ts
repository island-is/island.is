import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { ImporterInformationSubSection } from './ImporterInformation'
import { OperatorInformationSubSection } from './OperatorInformation'
import { OwnerInformationSubSection } from './OwnerInformation'

export const InformationSection = buildSection({
  id: 'informationSection',
  title: information.general.sectionTitle,
  children: [
    ImporterInformationSubSection,
    OwnerInformationSubSection,
    OperatorInformationSubSection,
  ],
})
