import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'
import { CreateContactInput } from './createContact.input'
import { CreateHelpdeskInput } from './createHelpdesk.input'

@InputType()
export class CreateOrganisationInput {
  @Field(() => String)
  @IsString()
  nationalId!: string

  @Field(() => String)
  @IsString()
  name!: string

  @Field(() => String)
  @IsString()
  address!: string

  @Field(() => String)
  @IsString()
  email!: string

  @Field(() => String)
  @IsString()
  phoneNumber!: string

  @Field(() => CreateContactInput, { nullable: true })
  @IsOptional()
  administrativeContact?: CreateContactInput

  @Field(() => CreateContactInput, { nullable: true })
  @IsOptional()
  technicalContact?: CreateContactInput

  @Field(() => CreateHelpdeskInput, { nullable: true })
  @IsOptional()
  helpdesk?: CreateHelpdeskInput
}
