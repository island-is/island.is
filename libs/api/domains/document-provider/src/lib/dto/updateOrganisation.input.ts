import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType()
export class UpdateOrganisationInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  nationalId?: string

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  name?: string

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  address?: string

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  email?: string

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  phoneNumber?: string

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  zendeskId?: string
}
