import { Field, ObjectType } from '@nestjs/graphql'

import { SignedUrl } from '@island.is/financial-aid/shared/index'

@ObjectType()
export class SignedUrlModel implements SignedUrl {
  @Field()
  readonly url!: string
  @Field()
  readonly key!: string
}
