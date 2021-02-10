import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SendLicenseInput {
  @Allow()
  @Field()
  readonly email!: string

  @Allow()
  @Field()
  readonly licenseId!: string
}
