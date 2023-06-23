import { buildSection, getValueViaPath } from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import { supportingDocuments } from '../../../lib/messages'
import { PassportSubSection } from './PassportSubSection'
import { OtherDocumentsSubSection } from './OtherDocumentsSubSection'
import { Citizenship } from '../../../lib/dataSchema'
import { getSelectedCustodyChildren } from '../../../utils'
import { CitizenIndividual } from '../../../shared'

export const SupportingDocumentsSection = (index: number) =>
  buildSection({
    id: `supportingDocuments${index}`,
    title: (application: Application) => {
      const answers = application.answers as Citizenship
      const selectedInCustody = getSelectedCustodyChildren(
        application.externalData,
        answers,
      )

      const individual = getValueViaPath(
        application.externalData,
        'individual.data',
        undefined,
      ) as CitizenIndividual | undefined

      return {
        ...supportingDocuments.general.sectionTitleWithPerson,
        values: {
          person:
            index === 0
              ? `${individual?.fullName}`
              : `${
                  selectedInCustody && selectedInCustody.length > index - 1
                    ? selectedInCustody[index - 1]?.fullName
                    : ''
                }`,
        },
      }
    },
    condition: (formValue: FormValue, externalData) => {
      const answers = formValue as Citizenship
      const selectedInCustody = getSelectedCustodyChildren(
        externalData,
        answers,
      )

      return (
        index === 0 ||
        (!!selectedInCustody && selectedInCustody.length > index - 1)
      )
    },
    children: [PassportSubSection(index), OtherDocumentsSubSection(index)],
  })
