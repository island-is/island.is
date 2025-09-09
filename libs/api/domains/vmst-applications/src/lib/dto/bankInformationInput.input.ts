import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

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
}
