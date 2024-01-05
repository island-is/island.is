import { Field, ObjectType } from '@nestjs/graphql'

//DEPRECATE - This is exceptionFromDirectMarketing field

@ObjectType('NationalRegistryBanMarking')
export class BanMarking {
  @Field(() => Boolean)
  banMarked?: boolean

  @Field(() => String)
  startDate?: string
}
