import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SendTeachingLicenseInput {
  @Allow()
  @Field()
  readonly email!: string

  @Allow()
  @Field()
  readonly teachingLicenseId!: string
}
