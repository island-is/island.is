import {
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import {
  DefaultEvents,
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import { format as formatKennitala } from 'kennitala'
import * as m from '../../../lib/messages'
import { applicantSubmitMessages as asm } from '../../../lib/messages/applicantSubmitMessages'
import {
  assigneePersonalInfoOverviewItems,
  assigneeAssetDeclarationOverviewItems,
  assigneeAddressMatchOverviewItems,
} from '../../../utils/getOverviewItems'

const getSignedAssigneeOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): KeyValueItem[] => {
  const signed =
    getValueViaPath<string[]>(answers, 'signedAssignees') ?? ([] as string[])
  const items: KeyValueItem[] = []

  signed.forEach((nationalId, index) => {
    const personalItems = assigneePersonalInfoOverviewItems(
      answers,
      externalData,
      nationalId,
    )
    const assetItems = assigneeAssetDeclarationOverviewItems(
      answers,
      externalData,
      nationalId,
    )
    const addressItems = assigneeAddressMatchOverviewItems(
      answers,
      externalData,
      nationalId,
    )

    if (index > 0) {
      items.push({
        width: 'full',
        keyText: '',
        valueText: '',
      })
    }

    items.push(
      {
        width: 'full',
        keyText: {
          ...m.draftMessages.overviewSection.nameIndex,
          values: { index: index + 1 },
        },
        valueText: formatKennitala(nationalId),
      },
      ...personalItems,
      ...assetItems,
      ...addressItems,
    )
  })

  return items
}

export const assigneeOverviewSection = buildSection({
  id: 'applicantSubmitAssigneeOverviewSection',
  tabTitle: asm.assigneeOverviewSectionTitle,
  children: [
    buildMultiField({
      id: 'applicantSubmitAssigneeOverviewMultiField',
      title: asm.assigneeOverviewTitle,
      description: asm.assigneeOverviewDescription,
      children: [
        buildOverviewField({
          id: 'submitAssigneeInfoOverview',
          title: m.draftMessages.householdMembersSection.title,
          items: getSignedAssigneeOverviewItems,
        }),
        buildSubmitField({
          id: 'applicantSubmitFormSubmit',
          title: asm.submitButton,
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: asm.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
