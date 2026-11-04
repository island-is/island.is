export const STATES_TAB_ID = 'states'
export const STRINGS_TAB_ID = 'strings'

export const withCount = (label: string, count: number) =>
  count > 0 ? `${label} (${count})` : label
