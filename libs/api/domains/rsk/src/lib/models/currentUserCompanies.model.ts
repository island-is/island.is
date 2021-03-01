import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CurrentUserCompanies {
  @Field()
  Kennitala!: string

  @Field()
  Nafn!: string

  @Field()
  StadaAdila!: string

  @Field()
  ErStjorn!: '0' | '1'

  @Field()
  ErProkuruhafi!: '0' | '1'
}
