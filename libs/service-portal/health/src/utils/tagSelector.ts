import { isDefined } from 'class-validator'

// Tag selector for expandable, sorting table in vaccinations
export const tagSelector = (str?: string | null) => {
  if (!isDefined(str)) return 'blue'

  const obj = {
    expired: 'blue',
    unvaccinated: 'red',
    undetermined: 'purple',
    valid: 'mint',
  }

  return (str && (obj as any)?.[str]) || 'blue'
}

//     Valid = 'valid',
//     Expired = 'expired',
//     Complete = 'complete',
//     Incomplete = 'incomplete',
//     Undocumented = 'undocumented',
//     Unvaccinated = 'unvaccinated',
//     Rejected = 'rejected',
//     Undetermined = 'undetermined'
