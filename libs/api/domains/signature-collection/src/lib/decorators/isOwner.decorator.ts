import { SetMetadata } from '@nestjs/common'

export const IsOwner = () => SetMetadata('is-owner', true)
