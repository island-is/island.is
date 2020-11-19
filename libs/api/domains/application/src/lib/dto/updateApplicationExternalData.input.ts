import { Field, InputType } from '@nestjs/graphql'
import { IsString, IsArray } from 'class-validator'

@InputType()
class DataProvider {
  @Field(() => String)
  @IsString()
  id: string

  @Field(() => String)
  @IsString()
  type: string
}

@InputType()
export class UpdateApplicationExternalDataInput {
  @Field(() => String)
  @IsString()
  id: string

  @Field(() => [DataProvider])
  @IsArray()
  dataProviders: DataProvider[]
}
