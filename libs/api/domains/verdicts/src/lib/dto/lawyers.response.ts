import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('WebVerdictLawyer')
class Lawyer {
  @Field(() => String)
  id!: string

  @Field(() => String)
  name!: string
}

@ObjectType('WebVerdictLawyersResponse')
export class LawyersResponse {
  @CacheField(() => [Lawyer])
  lawyers!: Lawyer[]
}
