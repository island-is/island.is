import { RskTreatyTabKey } from '../repositories/rsk-treaties/dto/rskTreaty.dto'

export const GENERIC_LIST_ID = '7GpKr4VzzRpitLSNBdWYRz'

export const OWNER_TAG = 'ownerSkatturinn'

export const TAG_IDS: Record<RskTreatyTabKey, string> = {
  samningar: '6eM8NhnAJoG73QmyrjSgPJ',
  adrirSamningar: '3HRIh69vTyqOZ7TofTSAqw',
  upplysingaskipti: '3UVgRczOHAqTk4xqgW8fsp',
}

export const TAB_KEY_DOCUMENT_TYPE_LABELS: Record<RskTreatyTabKey, string> = {
  samningar: 'Tvísköttunarsamningur',
  upplysingaskipti: 'Upplýsingaskiptasamningur',
  adrirSamningar: 'Annar samningur',
}

// When an item spans multiple tabs, prefer this order for internalTitle's
// type label (samningar takes priority over the others).
export const TAB_KEY_TITLE_PRIORITY: RskTreatyTabKey[] = [
  'samningar',
  'upplysingaskipti',
  'adrirSamningar',
]
