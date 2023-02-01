import {
  prettyName,
  RegName,
  RegulationOptionList,
} from '@island.is/regulations'
import { SelRegOption } from '../components/EditImpacts'
import { RegDraftForm } from '../state/types'
const PREFIX_AMENDING = 'Reglugerð um breytingu á reglugerð nr. '
const PREFIX_REPEALING = 'Reglugerð um breytingu á reglugerð nr. ' // repealingTitleRe

export const formatAmendingRegName = (draft: RegDraftForm) => {
  const impactArray = Object.values(draft.impacts)

  if (impactArray.length > 0) {
    const titleArray = impactArray
      .flat()
      .map((item) => `${item.name}${removeRegPrefix(item.regTitle)}`)

    return PREFIX_AMENDING + titleArray.join(' og ')
  }

  return PREFIX_AMENDING
}

const removeRegPrefix = (title: string) => {
  if (/^Reglugerð/.test(title)) {
    return title.replace(/^Reglugerð/, '')
  }
  return title
}
