import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsArray, IsNumber } from 'class-validator'

@InputType()
class DataProvider {
  @Field(() => String)
  @IsString()
  id!: string

  @Field(() => String)
  @IsString()
  type!: string

  @Field(() => Number, { nullable: true })
  @IsNumber()
  order?: number
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
