import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class FiskistofaQuotaType {
  @Field()
  id?: number

  @Field()
  name!: string

  @Field({ nullable: true })
  totalCatchQuota?: number

  @Field({ nullable: true })
  codEquivalent?: number
}
