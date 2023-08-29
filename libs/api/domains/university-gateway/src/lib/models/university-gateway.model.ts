import { Field, ObjectType } from '@nestjs/graphql'
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator'

import {
  UniversityGateway as TUniversityGateway,
  NameType,
  StatusType,
} from '@island.is/university-gateway-types'

@ObjectType()
export class UniversityGateway implements TUniversityGateway {
  @Field()
  @IsNumber()
  id!: number

  @Field()
  @IsString()
  icelandicName!: string

  @Field(() => String, { nullable: true })
  @IsEnum(NameType)
  type!: NameType | null

  @Field(() => String, { nullable: true })
  @IsEnum(StatusType)
  status!: StatusType | null

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  visible!: boolean | null

  @Field(() => String, { nullable: true })
  @IsString()
  description!: string | null

  @Field(() => String, { nullable: true })
  @IsString()
  verdict!: string | null

  @Field(() => String, { nullable: true })
  @IsString()
  url!: string | null

  @Field()
  @IsString()
  created!: Date

  @Field()
  modified!: Date
}
