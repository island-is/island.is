import { buildSection } from '@island.is/application/core'
import { TypeOfIdSubSection } from './TypeOfIdSubSection'
import { ChosenApplicantsSubSection } from './ChosenApplicantsSubSection'
import { idInformation } from '../../../lib/messages'
import { ConditionInformationSection } from './ConditionInformation'

export const IdInformationSection = buildSection({
  id: 'idInformation',
  title: idInformation.general.sectionTitle,
  children: [
    ChosenApplicantsSubSection,
    TypeOfIdSubSection,
    ConditionInformationSection,
  ],
})
