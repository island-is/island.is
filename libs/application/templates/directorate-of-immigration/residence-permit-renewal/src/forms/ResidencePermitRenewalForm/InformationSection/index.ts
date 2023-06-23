import { buildSection } from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import { information } from '../../../lib/messages'
import { StaysAbroadSubSection } from './StaysAbroadSubSection'
import { CriminalRecordSubSection } from './CriminalRecordSubSection'
import { PassportSubSection } from './PassportSubSection'
import { OtherDocumentsSubSection } from './OtherDocumentsSubSection'
import { ResidencePermitRenewalExternalData } from '../../../shared/types'

export const InformationSection = (index: number) =>
  buildSection({
    id: `information${index}`,
    title: (application: Application) => {
      const externalData = application.externalData as ResidencePermitRenewalExternalData

      return {
        ...information.general.sectionTitleWithPerson,
        values: {
          person: `${externalData?.nationalRegistry?.data?.fullName} ${
            index + 1
          }`,
        },
      }
    },
    condition: (formValue: FormValue) => {
      // TODO look at answers to know if we should display this information section
      return index < 2
    },
    children: [
      StaysAbroadSubSection,
      CriminalRecordSubSection,
      PassportSubSection,
      OtherDocumentsSubSection,
    ],
  })
