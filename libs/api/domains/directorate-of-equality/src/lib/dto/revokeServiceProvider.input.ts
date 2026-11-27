import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('DirectorateOfEqualityRevokeServiceProviderInput')
export class RevokeServiceProviderInput {
  @Field(() => String, {
    description: 'Id from directorateOfEqualityServiceProviders',
  })
  @IsString()
  id!: string
}
