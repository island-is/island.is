import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsArray, IsNumber } from 'class-validator'

@InputType()
class DataProvider {
  @Field(() => String)
  @IsString()
  actionId!: string

  @Field(() => Number)
  @IsNumber()
  order!: number
}

@InputType()
export class UpdateApplicationExternalDataInput {
  @Field(() => String)
  @IsString()
  id!: string

  @Field(() => [DataProvider])
  @IsArray()
  dataProviders!: DataProvider[]
}
