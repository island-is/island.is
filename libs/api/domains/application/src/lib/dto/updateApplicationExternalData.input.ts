import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsString, IsArray, IsEnum } from 'class-validator'
import { DataProviderDtoTypeEnum } from '../../../gen/fetch/models'

registerEnumType(DataProviderDtoTypeEnum, { name: 'DataProviderDtoTypeEnum' })

@InputType()
class DataProvider {
  @Field(() => String)
  @IsString()
  id: string

  @Field(() => DataProviderDtoTypeEnum)
  @IsEnum(DataProviderDtoTypeEnum)
  type: DataProviderDtoTypeEnum
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
