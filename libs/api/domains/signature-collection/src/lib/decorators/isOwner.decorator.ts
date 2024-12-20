import { SetMetadata } from '@nestjs/common'
import { IS_OWNER_KEY } from '../guards/constants'

export const IsOwner = () => SetMetadata(IS_OWNER_KEY, true)
