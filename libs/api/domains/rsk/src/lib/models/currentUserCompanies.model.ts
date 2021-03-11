import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CurrentUserCompanies {
  @Field()
  kennitala!: string

  @Field()
  nafn!: string

  @Field()
  stadaAdila!: string

  @Field()
  erStjorn!: '0' | '1'

  @Field()
  erProkuruhafi!: '0' | '1'
}
