import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class LicenseBookIdInput {
  @Field({ nullable: true })
  @IsString()
  id!: string
}
