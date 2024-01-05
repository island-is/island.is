import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class FiskistofaQuotaType {
  @Field()
  id?: number

  @Field()
  name!: string

  @Field({ nullable: true })
  totalCatchQuota?: number

  @Field({ nullable: true })
  codEquivalent?: number
}

@ObjectType()
export class FiskistofaQuotaTypeResponse {
  @CacheField(() => [FiskistofaQuotaType], { nullable: true })
  fiskistofaQuotaTypes?: FiskistofaQuotaType[] | null
}
