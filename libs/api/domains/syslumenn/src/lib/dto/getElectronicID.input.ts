import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetElectronicIDInput {
  @Field()
  @IsString()
  nationalId!: string
}
