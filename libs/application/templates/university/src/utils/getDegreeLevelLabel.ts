import { degreeLevelOptions } from '../lib/constants'

export const getDegreeLevelLabel = (value: string | undefined) => {
  return degreeLevelOptions.find((x) => x.value === value)?.label || ''
}
