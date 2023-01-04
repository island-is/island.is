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
  @Field(() => [FiskistofaQuotaType], { nullable: true })
  fiskistofaQuotaTypes?: FiskistofaQuotaType[] | null
}
