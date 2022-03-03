import { Field, InputType } from '@nestjs/graphql'
import { Allow } from 'class-validator'

@InputType()
export class FetchEducationSignedLicenseUrlInput {
  @Allow()
  @Field()
  readonly licenseId!: string
}
