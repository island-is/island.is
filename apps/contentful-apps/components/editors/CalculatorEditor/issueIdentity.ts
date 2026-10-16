export interface RowIdentity {
  tab: 'input' | 'output'
  sectionKey: string
  fieldUid?: string
  itemUid?: string
}

export const OUTPUT_TOTAL_SECTION_KEY = 'outputTotal'

export type IdentityMap = Map<string, RowIdentity>

export const resolveIssuePath = (
  path: (string | number)[],
  identity: IdentityMap,
): RowIdentity | undefined => {
  for (let length = path.length; length > 0; length -= 1) {
    const found = identity.get(path.slice(0, length).join('.'))
    if (found) return found
  }
  return undefined
}
