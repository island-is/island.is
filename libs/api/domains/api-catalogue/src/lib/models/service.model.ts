import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Service as IService } from '@island.is/api-catalogue/types'
import { IsArray, IsEnum, IsString } from 'class-validator'
import {
  AccessCategory,
  DataCategory,
  PricingCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'
import { ServiceEnvironment } from './serviceEnvironment.model'

@ObjectType()
export class Service implements IService {
  @Field(() => ID)
  @IsString()
  id!: string

  @Field(() => String)
  @IsString()
  owner!: string

  @Field(() => String)
  @IsString()
  title!: string

  @Field(() => String)
  @IsString()
  summary!: string

  @Field(() => String)
  @IsString()
  description!: string

  @Field(() => [PricingCategory])
  @IsEnum(PricingCategory)
  pricing!: Array<PricingCategory>

  @Field(() => [DataCategory])
  @IsEnum(DataCategory)
  data!: Array<DataCategory>

  @Field(() => [TypeCategory])
  @IsEnum(TypeCategory)
  type!: Array<TypeCategory>

  @Field(() => [AccessCategory])
  @IsEnum(AccessCategory)
  access!: Array<AccessCategory>

  @Field(() => [ServiceEnvironment])
  @IsArray()
  environments!: Array<ServiceEnvironment>
}
