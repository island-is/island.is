import { buildSection } from '@island.is/application/core'
import {
  Application,
  FormValue,
  Section,
  SubSection,
} from '@island.is/application/types'
import { supportingDocuments } from '../../../lib/messages'
import { PassportSubSection } from './PassportSubSection'
import { OtherDocumentsSubSection } from './OtherDocumentsSubSection'
import { CitizenshipExternalData } from '../../../shared/types'
import { ExternalData } from '../../../types'
import { Citizenship } from '../../../lib/dataSchema'
import { getSelectedCustodyChildren } from '../../../utils/childrenInfo'

export const SupportingDocumentsSection = (index: number) =>
  buildSection({
    id: `supportingDocuments${index}`,
    title: (application: Application) => {
      const externalData = application.externalData as ExternalData
      const answers = application.answers as Citizenship
      const selectedInCustody = getSelectedCustodyChildren(
        externalData,
        answers,
      )

      return {
        ...supportingDocuments.general.sectionTitleWithPerson,
        values: {
          person:
            index === 0
              ? `${externalData?.individual?.data?.fullName}`
              : `${
                  selectedInCustody && selectedInCustody.length > index - 1
                    ? selectedInCustody[index - 1]?.fullName
                    : ''
                }`,
        },
      }
    },
    condition: (formValue: FormValue, externalData) => {
      const external = externalData as ExternalData
      const answers = formValue as Citizenship
      const selectedInCustody = getSelectedCustodyChildren(external, answers)

      return (
        index === 0 ||
        (!!selectedInCustody && selectedInCustody.length > index - 1)
      )
    },
    children: [PassportSubSection(index), OtherDocumentsSubSection(index)],
  })
