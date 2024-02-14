import { Field, ObjectType, ID } from '@nestjs/graphql'

import { ApiKeysForMunicipality } from '@island.is/financial-aid/shared/lib'

@ObjectType()
export class ApiKeysModel implements ApiKeysForMunicipality {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly name!: string

  @Field()
  readonly apiKey!: string

  @Field()
  readonly municipalityCode!: string
}
