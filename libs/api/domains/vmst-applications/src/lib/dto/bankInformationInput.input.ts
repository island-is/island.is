import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsNumber, IsString } from 'class-validator'

@InputType('VmstApplicationsBankInformationPensionFundInput')
export class VmstApplicationsBankInformationPensionFundInput {
  @Field()
  @IsString()
  id!: string

  @Field()
  @IsNumber()
  percentage!: number
}

@InputType('VmstApplicationsBankInformationUnionInput')
export class VmstApplicationsBankInformationUnionInput {
  @Field()
  @IsString()
  id!: string
}

@InputType('VmstApplicationsBankInformationPrivatePensionInput')
export class VmstApplicationsBankInformationPrivatePensionInput {
  @Field()
  @IsString()
  id!: string

  @Field()
  @IsNumber()
  percentage!: number
}

@InputType('VmstApplicationsBankInformationInput')
export class VmstApplicationsBankInformationInput {
  @Field()
  @IsString()
  bankNumber!: string

  @Field()
  @IsString()
  ledger!: string

  @Field()
  @IsString()
  accountNumber!: string

  @Field(() => VmstApplicationsBankInformationPensionFundInput, {
    nullable: true,
  })
  pensionFund?: VmstApplicationsBankInformationPensionFundInput

  @Field({ nullable: true })
  @IsOptional()
  doNotPayToUnion?: boolean

  @Field(() => VmstApplicationsBankInformationUnionInput, { nullable: true })
  union?: VmstApplicationsBankInformationUnionInput

  @Field(() => [VmstApplicationsBankInformationPrivatePensionInput], {
    nullable: true,
  })
  privatePensionFunds?: VmstApplicationsBankInformationPrivatePensionInput[]
}
