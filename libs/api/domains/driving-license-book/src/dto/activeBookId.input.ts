import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ActiveBookIdInput {
  @Field({ nullable: true })
  @IsString()
  ssn!: string

  @Field({ nullable: true })
  @IsString()
  licenseCategory!: string
}
