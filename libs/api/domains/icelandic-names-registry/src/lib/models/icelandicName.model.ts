import { Field, ObjectType } from '@nestjs/graphql'
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator'

import {
  IcelandicName as TIcelandicName,
  NameType,
  StatusType,
} from '@island.is/icelandic-names-registry-types'

@ObjectType()
export class IcelandicName implements TIcelandicName {
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
