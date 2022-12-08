import { SetMetadata } from '@nestjs/common'

export const BYPASS_DELEGATION_KEY = 'bypassDelegation'
export const BypassDelegation = () => {
  return SetMetadata(BYPASS_DELEGATION_KEY, true)
}
