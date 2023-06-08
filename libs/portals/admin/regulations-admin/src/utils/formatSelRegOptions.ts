import {
  prettyName,
  RegName,
  RegulationOptionList,
} from '@island.is/regulations'
import { SelRegOption } from '../components/EditImpacts'

export const formatSelRegOptions = (
  regulationNames: RegName[],
  notFoundText: string,
  repealedText: string,
  data?: RegulationOptionList,
) => {
  const options = regulationNames.map((name): SelRegOption => {
    const reg = data?.find((r) => r.name === name)
    if (reg) {
      return {
        type: reg.type,
        disabled: !!reg.repealed,
        value: name,
        label:
          prettyName(name) +
          ' – ' +
          reg.title +
          (reg.repealed ? ` (${repealedText})` : ''),
        migrated: reg.migrated,
      }
    }
    return {
      type: '',
      disabled: true,
      value: '',
      label: prettyName(name) + ' ' + notFoundText,
    }
  })

  return options as SelRegOption[]
}
