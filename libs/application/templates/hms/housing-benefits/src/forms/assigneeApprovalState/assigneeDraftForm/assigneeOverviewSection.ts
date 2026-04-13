import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import * as m from '../../../lib/messages'
import {
  assigneePersonalInfoOverviewItems,
  assigneeAssetDeclarationOverviewItems,
  assigneeAddressMatchOverviewItems,
} from '../../../utils/getOverviewItems'

export const assigneeOverviewSection = buildSection({
  id: 'assigneeOverviewSection',
  title: m.assigneeDraftOverview.title,
  children: [
    buildMultiField({
      id: 'assigneeOverview',
      title: m.assigneeDraftOverview.title,
      description: m.assigneeDraftOverview.description,
      children: [
        buildOverviewField({
          id: 'assigneePersonalInfoOverview',
          title: m.assigneeDraftOverview.personalInfoTitle,
          backId: 'assigneeInfo',
          items: assigneePersonalInfoOverviewItems,
        }),
        buildOverviewField({
          id: 'assigneeAssetDeclarationOverview',
          title: m.assigneeDraftOverview.assetDeclarationTitle,
          backId: 'assetDecleration',
          items: assigneeAssetDeclarationOverviewItems,
        }),
        buildOverviewField({
          id: 'assigneeAddressMatchOverview',
          title: m.assigneeDraftOverview.addressMatchTitle,
          items: assigneeAddressMatchOverviewItems,
        }),
        buildSubmitField({
          id: 'assigneeOverviewSubmit',
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.assigneeDraftOverview.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
