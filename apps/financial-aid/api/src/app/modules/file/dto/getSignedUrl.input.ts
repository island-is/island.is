import { Field, InputType } from '@nestjs/graphql'
import { Allow } from 'class-validator'

import { GetSignedUrl } from '@island.is/financial-aid/shared/lib'

@InputType()
export class GetSignedUrlInput implements GetSignedUrl {
  @Allow()
  @Field()
  readonly fileName!: string
}
