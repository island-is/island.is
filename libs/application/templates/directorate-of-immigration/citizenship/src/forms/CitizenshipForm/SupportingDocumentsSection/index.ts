import { buildSection } from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import { supportingDocuments } from '../../../lib/messages'
import { PassportSubSection } from './PassportSubSection'
import { OtherDocumentsSubSection } from './OtherDocumentsSubSection'
import { getSelectedIndividualName, isIndividualSelected } from '../../../utils'

export const SupportingDocumentsSection = (index: number) =>
  buildSection({
    id: `supportingDocuments${index}`,
    title: (application: Application) => {
      return {
        ...supportingDocuments.general.sectionTitleWithPerson,
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
    children: [PassportSubSection(index), OtherDocumentsSubSection(index)],
  })
