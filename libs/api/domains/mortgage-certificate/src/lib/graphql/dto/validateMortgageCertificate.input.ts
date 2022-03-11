import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ValidateMortgageCertificateInput {
  @Field()
  @IsString()
  propertyNumber!: string
}
