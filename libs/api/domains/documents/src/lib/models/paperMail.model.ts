import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class PaperMailBody {
  @Field(() => String)
  nationalId?: string

  @Field(() => Boolean)
  wantsPaper?: boolean
}
