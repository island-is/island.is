import type { CreateDirectGrantPaymentUrlInput } from './dto/createDirectGrantPaymentUrl.input'
import type { CreateMemorialCardPaymentUrlInput } from './dto/createMemorialCardPaymentUrl.input'

export interface MemorialCardCallbackMetadata
  extends CreateMemorialCardPaymentUrlInput {
  type: 'memorialCard'
}

export interface DirectGrantCallbackMetadata
  extends CreateDirectGrantPaymentUrlInput {
  type: 'directGrant'
}
