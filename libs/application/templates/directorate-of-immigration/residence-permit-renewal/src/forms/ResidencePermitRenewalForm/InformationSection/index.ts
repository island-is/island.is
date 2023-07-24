import { buildSection } from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import { information } from '../../../lib/messages'
import { StaysAbroadSubSection } from './StaysAbroadSubSection'
import { CriminalRecordSubSection } from './CriminalRecordSubSection'
import { PassportSubSection } from './PassportSubSection'
import { OtherDocumentsSubSection } from './OtherDocumentsSubSection'
import { StudySubSection } from './StudySubSection'
import { EmploymentSubSection } from './EmploymentSubSection'
import { getSelectedIndividualName, isIndividualSelected } from '../../../utils'

export const InformationSection = (index: number) =>
  buildSection({
    id: `information${index}`,
    title: (application: Application) => {
      return {
        ...information.general.sectionTitleWithPerson,
        values: {
          person:
            getSelectedIndividualName(
              application.externalData,
              application.answers,
              index,
            ) || '',
        },
      }
    },
    condition: (formValue: FormValue, externalData) => {
      return isIndividualSelected(externalData, formValue, index)
    },
    children: [
      StaysAbroadSubSection(index),
      CriminalRecordSubSection(index),
      StudySubSection(index),
      EmploymentSubSection(index),
      PassportSubSection(index),
      OtherDocumentsSubSection(index),
    ],
  })
