import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetRealEstateInput {
  @Field()
  @IsString()
  assetId!: string
}
