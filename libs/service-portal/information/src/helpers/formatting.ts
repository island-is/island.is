import {
  NationalRegistryUser,
  NationalRegistryChild,
} from '@island.is/api/schema'
import { ExcludesFalse } from '@island.is/service-portal/core'

export const formatNameBreaks = (
  user: NationalRegistryUser | NationalRegistryChild | undefined,
): string | undefined => {
  if (!user) return undefined

  const { firstName, middleName, lastName } = user

  const first = firstName ? `Eiginnafn: ${firstName}` : undefined
  const middle = middleName ? `Millinafn: ${middleName}` : undefined
  const last = lastName ? `Kenninafn: ${lastName}` : undefined

  const formatted = [first, middle, last]
    .filter((Boolean as unknown) as ExcludesFalse)
    .join('\n')

  return formatted
}
