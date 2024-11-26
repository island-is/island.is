import {
  buildCustomField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import { ApplicantChildCustodyInformation } from '@island.is/application/types'

export const childrenFilesSubSection = buildSubSection({
  condition: (_, externalData) => {
    const childWithInfo = getValueViaPath<
      Array<ApplicantChildCustodyInformation>
    >(externalData, 'childrenCustodyInformation.data', [])

    return Boolean(childWithInfo?.length)
  },
  id: Routes.CHILDRENFILES,
  title: m.childrenFilesForm.general.sectionTitle,
  children: [
    buildMultiField({
      title: m.childrenFilesForm.general.pageTitle,
      description: m.childrenFilesForm.general.description,
      children: [
        buildCustomField({
          id: Routes.CHILDRENFILES,
          title: m.childrenFilesForm.general.pageTitle,
          component: 'ChildrenFilesForm',
        }),
      ],
    }),
  ],
})
