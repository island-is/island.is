import { buildSection } from '@island.is/application/core'
import { Application, FormValue } from '@island.is/application/types'
import { supportingDocuments } from '../../../lib/messages'
import { ChildrenPassportSubSection } from '../ChildrenSupportingDocuments/ChildrenPassportSubSection'
import { ChildrenOtherDocumentsSubSection } from './ChildrenOtherDocumentsSubSection'
import { getSelectedIndividualName, isIndividualSelected } from '../../../utils'
import { Routes } from '../../../lib/constants'

export const ChildrenSupportingDocumentsSection = (index: number) =>
  buildSection({
    id: Routes.CHILDSUPPORTINGDOCUMENTS,
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
    children: [
      ChildrenPassportSubSection(index),
      ChildrenOtherDocumentsSubSection(index),
    ],
  })
