import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SignatureCollectionCollector {
  @Field()
  nationalId!: string

  @Field()
  name!: string
}
