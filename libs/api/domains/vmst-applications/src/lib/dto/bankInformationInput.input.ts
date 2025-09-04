import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType('BankInformationInput')
export class BankInformationInput {
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
