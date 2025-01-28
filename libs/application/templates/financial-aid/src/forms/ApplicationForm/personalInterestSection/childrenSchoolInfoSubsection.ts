import { buildCustomField } from '@island.is/application/core'
import { buildSubSection } from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import { hasChildren } from '../../../utils/conditions'
import * as m from '../../../lib/messages'

export const childrenSchoolInfoSubsection = buildSubSection({
  condition: hasChildren,
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
