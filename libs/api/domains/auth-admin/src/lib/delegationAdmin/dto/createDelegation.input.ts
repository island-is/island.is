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

  @Field(() => Date, { nullable: true })
  @IsOptional()
  validTo?: Date

  @Field(() => String)
  @IsString()
  type!: string

  @Field(() => String)
  @IsString()
  referenceId!: string
}
