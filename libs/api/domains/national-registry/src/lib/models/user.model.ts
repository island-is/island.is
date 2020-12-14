import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import { IsEnum } from 'class-validator'
import { Gender } from '../types/gender.enum'
import { MaritalStatus } from '../types/maritalStatus.enum'
import { BanMarking } from './banMarking.model'

registerEnumType(MaritalStatus, {
  name: 'MaritalStatus',
})

registerEnumType(Gender, {
  name: 'Gender',
})

@ObjectType()
export class NationalRegistryUser {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  fullName!: string

  @IsEnum(Gender)
  @Field(() => [Gender], { nullable: true })
  gender?: Array<Gender>

  @Field(() => String, { nullable: true })
  legalResidence?: string

  @Field(() => String, { nullable: true })
  birthPlace?: string

  @Field(() => String, { nullable: true })
  citizenship?: string

  @Field(() => String, { nullable: true })
  religion?: string

  @IsEnum(MaritalStatus)
  @Field(() => [MaritalStatus], { nullable: true })
  maritalStatus?: Array<MaritalStatus>

  @Field(() => BanMarking, { nullable: true })
  banMarking?: BanMarking
}
