import {
  FormValue,
  ExternalData,
  KeyValueItem,
} from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { assigneePersonalInfoOverviewItems } from './getOverviewItems'
import { assigneeAssetDeclarationOverviewItems } from './getOverviewItems'
import { assigneeAddressMatchOverviewItems } from './getOverviewItems'
import {
  format as formatKennitala,
  sanitize as sanitizeKennitala,
} from 'kennitala'
import * as m from '../lib/messages'

export const getSignedAssigneeOverviewItems = (
  answers: FormValue,
  externalData: ExternalData,
): KeyValueItem[] => {
  const signed =
    getValueViaPath<string[]>(answers, 'signedAssignees') ?? ([] as string[])
  const items: KeyValueItem[] = []

  signed.forEach((nationalId, index) => {
    const prefix = sanitizeKennitala(nationalId)
    const name =
      getValueViaPath<string>(answers, `${prefix}.assigneeInfo.name`) ?? ''

    const personalItems = assigneePersonalInfoOverviewItems(
      answers,
      externalData,
      nationalId,
    )
    const filteredPersonalItems = personalItems.filter(
      (item) =>
        item.keyText !== m.draftMessages.overviewSection.name &&
        item.keyText !== m.draftMessages.overviewSection.nationalId,
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

    items.push(
      {
        width: 'full',
        keyText: name,
        valueText: formatKennitala(nationalId),
        ...(index > 0 && { lineAboveKeyText: true }),
      },
      ...filteredPersonalItems,
      ...assetItems,
      ...addressItems,
    )
  })

  return items
}
