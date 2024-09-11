import {
  buildCustomField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import { ApplicantChildCustodyInformation } from '@island.is/application/types'

export const childrenSubSection = buildSubSection({
  condition: (_, externalData) => {
    const childWithInfo = getValueViaPath(
      externalData,
      'childrenCustodyInformation.data',
      [],
    ) as ApplicantChildCustodyInformation[]

    return Boolean(childWithInfo?.length)
  },
  id: Routes.CHILDRENSCHOOLINFO,
  title: m.childrenForm.general.sectionTitle,
  children: [
    buildCustomField({
      id: Routes.CHILDRENSCHOOLINFO,
      title: m.childrenForm.general.pageTitle,
      component: 'ChildrenForm',
    }),
  ],
})
