import { InputType, Field } from '@nestjs/graphql'
import {
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
  IsDate,
  IsIn,
  IsEmail,
} from 'class-validator'

@InputType()
export class VistaSkjalInput {
  @Field(() => String)
  @IsNotEmpty()
  applicationNumber!: string

  @Field(() => Date)
  @IsNotEmpty()
  @IsDate()
  applicationDate!: Date

  @Field(() => String)
  @IsNotEmpty()
  @MaxLength(10)
  @MinLength(10)
  nationalId!: string

  @Field(() => String)
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(15)
  foreignNationalId!: string

  @Field(() => String)
  @IsNotEmpty()
  @MaxLength(100)
  name!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MaxLength(100)
  address?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MaxLength(100)
  postalAddress?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MaxLength(100)
  citizenship?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MaxLength(4)
  countryCode?: string

  @Field(() => String)
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email!: string

  @Field(() => String)
  @IsNotEmpty()
  @MaxLength(20)
  phoneNumber!: string

  @Field(() => Date || undefined, { nullable: true })
  @IsOptional()
  @IsDate()
  residenceDateFromNationalRegistry?: Date

  @Field(() => Date || undefined, { nullable: true })
  @IsOptional()
  @IsDate()
  residenceDateUserThink?: Date

  @Field(() => String)
  @IsNotEmpty()
  @IsIn(['S', 'P', 'O'])
  userStatus!: string

  @Field(() => Number)
  @IsNotEmpty()
  @IsIn([0, 1])
  isChildrenFollowed!: number

  @Field(() => String)
  @IsNotEmpty()
  previousCountry!: string

  @Field(() => String)
  @IsNotEmpty()
  previousCountryCode!: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  previousIssuingInstitution?: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  additionalInformation?: string

  @Field(() => Number)
  @IsNotEmpty()
  @IsIn([0, 1])
  isHealthInsuredInPreviousCountry!: number

  @Field(() => Number)
  @IsNotEmpty()
  @IsIn([0, 1])
  hasHealthInsuranceRightInPreviousCountry!: number

  @Field(() => [String], { nullable: true })
  @IsOptional()
  attachmentsFileNames?: string[]
}
