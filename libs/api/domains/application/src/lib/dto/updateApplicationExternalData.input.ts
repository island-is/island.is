import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsString, IsArray, IsEnum } from 'class-validator'
import { DataProviderDTOTypeEnum } from '../../../gen/fetch/models'

registerEnumType(DataProviderDTOTypeEnum, { name: 'DataProviderDTOTypeEnum' })

@InputType()
class DataProvider {
  @Field(() => String)
  @IsString()
  id: string

  @Field(() => DataProviderDTOTypeEnum)
  @IsEnum(DataProviderDTOTypeEnum)
  type: DataProviderDTOTypeEnum
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
