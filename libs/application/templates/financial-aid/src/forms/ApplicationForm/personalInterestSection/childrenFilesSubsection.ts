import { buildCustomField } from '@island.is/application/core'
import { buildSubSection } from '@island.is/application/core'
import { Routes } from '../../../lib/constants'
import { hasChildren } from '../../../utils/conditions'
import * as m from '../../../lib/messages'

export const childrenFilesSubsection = buildSubSection({
  condition: hasChildren,
  id: Routes.CHILDRENFILES,
  title: m.childrenFilesForm.general.sectionTitle,
  children: [
    buildCustomField({
      id: Routes.CHILDRENFILES,
      title: m.childrenFilesForm.general.pageTitle,
      component: 'ChildrenFilesForm',
    }),
  ],
})
