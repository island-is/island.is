import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { GetSignedUrl } from '@island.is/financial-aid/shared/index'

@InputType()
export class GetSignedUrlInput implements GetSignedUrl {
  @Allow()
  @Field()
  readonly fileName!: string
}
