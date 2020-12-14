import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IsEnum, isEnum } from 'class-validator'
import { Gender } from '../types/gender.enum'
import { MaritalStatus } from '../types/maritalStatus.enum'
import { BanMarking } from './banMarking.model'

@ObjectType()
export class NationalRegistryUser {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @IsEnum(Gender)
  @Field(() => Gender, { nullable: true })
  gender?: Gender

  @Field(() => String, { nullable: true })
  legalResidence?: string

  @Field(() => String, { nullable: true })
  birthPlace?: string

  @Field(() => String, { nullable: true })
  citizenship?: string

  @Field(() => String, { nullable: true })
  religion?: string

  @IsEnum(MaritalStatus)
  @Field(() => MaritalStatus, { nullable: true })
  maritalStatus?: MaritalStatus

  @Field(() => BanMarking, { nullable: true })
  banMarking?: BanMarking
}
