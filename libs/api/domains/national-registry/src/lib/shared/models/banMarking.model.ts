import { Field, ObjectType } from '@nestjs/graphql'

//DEPRECATE - This is exceptionFromDirectMarketing field

@ObjectType('NationalRegistryBanMarking')
export class BanMarking {
  @Field(() => Boolean)
  banMarked?: boolean

  // Note: Made a backwards incompatible change to this field to be nullable.
  // It is currently never queried, and we don't have this data in V3 broker.
  @Field(() => String, { nullable: true })
  startDate?: string
}
