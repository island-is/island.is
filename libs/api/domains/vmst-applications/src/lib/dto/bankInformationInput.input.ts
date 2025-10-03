import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsString } from 'class-validator'

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

  @Field(() => VmstApplicationsBankInformationUnionInput, { nullable: true })
  union?: VmstApplicationsBankInformationUnionInput

  @Field(() => [VmstApplicationsBankInformationPrivatePensionInput], {
    nullable: true,
  })
  privatePensionFunds?: VmstApplicationsBankInformationPrivatePensionInput[]
}

@InputType('VmstApplicationsBankInformationPensionFundInput')
export class VmstApplicationsBankInformationPensionFundInput {
  @Field()
  @IsString()
  Id!: string

  @Field()
  @IsNumber()
  percentage!: number
}

@InputType('VmstApplicationsBankInformationUnionInput')
export class VmstApplicationsBankInformationUnionInput {
  @Field()
  @IsString()
  Id!: string
}

@InputType('VmstApplicationsBankInformationPrivatePensionInput')
export class VmstApplicationsBankInformationPrivatePensionInput {
  @Field()
  @IsString()
  Id!: string

  @Field()
  @IsNumber()
  percentage!: number
}
