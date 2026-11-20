import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('DirectorateOfEqualityGrantServiceProviderInput')
export class GrantServiceProviderInput {
  @Field(() => String, {
    description: 'Id from directorateOfEqualityAvailableServiceProviders',
  })
  @IsString()
  id!: string
}

@InputType('DirectorateOfEqualityRevokeServiceProviderInput')
export class RevokeServiceProviderInput {
  @Field(() => String, {
    description: 'Id from directorateOfEqualityServiceProviders',
  })
  @IsString()
  id!: string
}
