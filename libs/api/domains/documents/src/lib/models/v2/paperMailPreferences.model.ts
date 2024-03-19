import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('DocumentV2PaperMailPreferences')
export class PaperMailPreferences {
  @Field(() => String)
  nationalId!: string

  @Field()
  wantsPaper!: boolean
}
