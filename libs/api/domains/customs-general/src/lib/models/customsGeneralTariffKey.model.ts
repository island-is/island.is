import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CustomsGeneralTariffKey {
  @Field(() => String)
  version!: string

  @Field(() => String)
  description!: string

  @Field(() => Date)
  periodFrom!: Date

  @Field(() => Date)
  periodTo!: Date

  @Field(() => String)
  jsonUrl!: string

  @Field(() => String)
  textUrl!: string
}
