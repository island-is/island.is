import { buildSection } from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import { supportingDocuments } from '../../../lib/messages'
import { PassportSubSection } from './PassportSubSection'
import { OtherDocumentsSubSection } from './OtherDocumentsSubSection'
import { CitizenshipExternalData } from '../../../shared/types'

export const SupportingDocumentsSection = (index: number) =>
  buildSection({
    id: `supportingDocuments${index}`,
    // title: supportingDocuments.general.sectionTitle,
    title: (application: Application) => {
      const externalData = application.externalData as CitizenshipExternalData

      return {
        ...supportingDocuments.general.sectionTitleWithPerson,
        values: {
          person: `${externalData?.nationalRegistry?.data?.fullName} ${
            index + 1
          }`,
        },
      }
    },
    condition: (formValue: FormValue) => {
      // TODOx look at answers to know if we should display this information section
      return index < 2
    },
    children: [PassportSubSection, OtherDocumentsSubSection],
  })
