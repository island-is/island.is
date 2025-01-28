import { SetMetadata } from '@nestjs/common'
import { CodeOwners } from '@island.is/shared/constants'

export const CODE_OWNER_KEY = 'codeOwner'

export const CodeOwner = (codeOwner: CodeOwners) =>
  SetMetadata(CODE_OWNER_KEY, codeOwner)
