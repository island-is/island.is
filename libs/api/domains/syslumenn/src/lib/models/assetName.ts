import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AssetName {
  @Field()
  name!: string
}
