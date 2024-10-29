import { SetMetadata } from '@nestjs/common'
import { ALLOW_DELEGATION_KEY } from '../guards/constants'

export const AllowDelegation = () => SetMetadata(ALLOW_DELEGATION_KEY, true)
