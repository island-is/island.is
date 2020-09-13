import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ContentfulAssetBlob {
  @Field()
  blob: string
}
