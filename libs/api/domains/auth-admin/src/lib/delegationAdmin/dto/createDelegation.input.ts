import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class CreateDelegationInput {
  @Field(() => String)
  @IsString()
  fromNationalId!: string

  @Field(() => String)
  @IsString()
  toNationalId!: string

  @Field(() => String, {
    nullable: true,
    description: 'Date format: YYYY-MM-DD',
  })
  @IsString()
  @IsOptional()
  validTo?: string

  @Field(() => String)
  @IsString()
  type!: string

  @Field(() => String)
  @IsString()
  referenceId!: string
}
