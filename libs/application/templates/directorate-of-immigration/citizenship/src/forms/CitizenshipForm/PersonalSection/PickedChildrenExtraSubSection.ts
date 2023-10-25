import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
  getValueViaPath,
} from '@island.is/application/core'
import { selectChildren } from '../../../lib/messages'
import { Routes } from '../../../lib/constants'

export const PickChildrenExtraSubSection = buildSubSection({
  id: Routes.PICKCHILDRENEXTRA,
  title: selectChildren.extraInformation.subSectionTitle,
  condition: (answers) => {
    const childWithInfo = getValueViaPath(
      answers,
      'selectedChildren',
      [],
    ) as string[]

    return childWithInfo ? childWithInfo.length > 0 : false
  },
  children: [
    buildMultiField({
      id: Routes.PICKCHILDRENEXTRA,
      title: selectChildren.extraInformation.pageTitle,
      description: selectChildren.extraInformation.description,
      children: [
        buildCustomField({
          id: 'selectedChildrenExtraData',
          title: selectChildren.extraInformation.pageTitle,
          component: 'MoreChildInfo',
        }),
      ],
    }),
  ],
})
