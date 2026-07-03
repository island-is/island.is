import { ApiProperty } from '@nestjs/swagger'
import { buildMessage, IsArray, IsString, ValidateBy } from 'class-validator'

import {
  AuthDelegationType,
  isPersonalRepresentativeDelegationType,
} from '@island.is/shared/types'

// Delegations sourced from the district commissioners registry carry compound
// personal representative types, e.g. PersonalRepresentative:postholf, which
// are not members of the AuthDelegationType enum.
const isValidDelegationType = (value: unknown): boolean =>
  typeof value === 'string' &&
  (Object.values(AuthDelegationType).includes(value as AuthDelegationType) ||
    isPersonalRepresentativeDelegationType(value))

export class DelegationVerification {
  @IsString()
  @ApiProperty()
  fromNationalId!: string

  @IsArray()
  @ValidateBy(
    {
      name: 'isDelegationType',
      validator: {
        validate: isValidDelegationType,
        defaultMessage: buildMessage(
          (eachPrefix) =>
            `${eachPrefix}$property must be an AuthDelegationType or a personal representative delegation type`,
        ),
      },
    },
    { each: true },
  )
  @ApiProperty({
    type: String,
    isArray: true,
    description:
      'AuthDelegationType values or compound personal representative delegation types, e.g. PersonalRepresentative:postholf',
    example: [
      AuthDelegationType.ProcurationHolder,
      'PersonalRepresentative:postholf',
    ],
  })
  delegationTypes!: AuthDelegationType[]
}
