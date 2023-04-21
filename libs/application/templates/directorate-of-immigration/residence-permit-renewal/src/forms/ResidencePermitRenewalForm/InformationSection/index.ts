import { buildSection } from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { StaysAbroadSubSection } from './StaysAbroadSubSection'
import { CriminalRecordSubSection } from './CriminalRecordSubSection'
import { PassportSubSection } from './PassportSubSection'
import { SupportingDocumentsSubSection } from './SupportingDocumentsSubSection'
import { Application, ExternalData } from '@island.is/application/types'
import { Scalars } from '@island.is/api/schema'
import { ResidencePermitExternalData } from '../../../shared/types'

export const InformationSection = (index: number) =>
  buildSection({
    id: `information${index}`,
    title: (application: Application) => {
      const externalData = application.externalData as ResidencePermitExternalData

      return {
        ...information.general.sectionTitleWithPerson,
        values: {
          person: externalData?.nationalRegistry?.data?.fullName,
        },
      }
    },
    children: [
      StaysAbroadSubSection,
      CriminalRecordSubSection,
      PassportSubSection,
      SupportingDocumentsSubSection,
    ],
  })
