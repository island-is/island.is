import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsString } from 'class-validator'

import { DirectorateOfEqualityApiKeyType } from '../models/enums'

@InputType('DirectorateOfEqualityRevokeApiKeyInput')
export class RevokeApiKeyInput {
  @Field(() => String)
  @IsString()
  id!: string

  @Field(() => DirectorateOfEqualityApiKeyType)
  @IsEnum(DirectorateOfEqualityApiKeyType)
  type!: DirectorateOfEqualityApiKeyType
}
