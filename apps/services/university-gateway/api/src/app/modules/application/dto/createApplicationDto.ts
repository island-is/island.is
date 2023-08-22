import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import {
  CreateApplication,
  HomeCircumstances,
  Employment,
  ApplicationState,
  FamilyStatus,
} from '@island.is/university-gateway/types'

import { CreateApplicationFileInput } from '../../file/dto'
import { DirectTaxPaymentInput } from './directTaxPayment.input'

@InputType()
export class CreateApplicationInput implements CreateApplication {
  @Allow()
  @Field()
  readonly name!: string

  @Allow()
  @Field({ nullable: true })
  readonly phoneNumber?: string

  @Allow()
  @Field()
  readonly email!: string

  @Allow()
  @Field(() => String)
  readonly homeCircumstances!: HomeCircumstances

  @Allow()
  @Field({ nullable: true })
  readonly homeCircumstancesCustom?: string

  @Allow()
  @Field()
  readonly student!: boolean

  @Allow()
  @Field({ nullable: true })
  readonly studentCustom?: string

  @Allow()
  @Field(() => String)
  readonly employment!: Employment

  @Allow()
  @Field({ nullable: true })
  readonly employmentCustom?: string

  @Allow()
  @Field()
  readonly hasIncome!: boolean

  @Allow()
  @Field()
  readonly usePersonalTaxCredit!: boolean

  @Allow()
  @Field({ nullable: true })
  readonly bankNumber?: string

  @Allow()
  @Field({ nullable: true })
  readonly ledger?: string

  @Allow()
  @Field({ nullable: true })
  readonly accountNumber?: string

  @Allow()
  @Field({ nullable: true })
  readonly interview?: boolean

  @Allow()
  @Field({ nullable: true })
  readonly formComment?: string

  @Allow()
  @Field(() => String)
  readonly state!: ApplicationState

  @Allow()
  @Field(() => [CreateApplicationFileInput])
  readonly files!: CreateApplicationFileInput[]

  @Allow()
  @Field({ nullable: true })
  readonly amount?: number

  @Allow()
  @Field({ nullable: true })
  readonly spouseName?: string

  @Allow()
  @Field({ nullable: true })
  readonly spouseNationalId?: string

  @Allow()
  @Field({ nullable: true })
  readonly spouseEmail?: string

  @Allow()
  @Field(() => String)
  readonly familyStatus!: FamilyStatus

  @Allow()
  @Field({ nullable: true })
  readonly city?: string

  @Allow()
  @Field({ nullable: true })
  readonly streetName?: string

  @Allow()
  @Field()
  readonly municipalityCode!: string

  @Allow()
  @Field({ nullable: true })
  readonly postalCode?: string

  @Allow()
  @Field({ nullable: true })
  readonly hasFetchedDirectTaxPayment!: boolean

  @Allow()
  @Field(() => [DirectTaxPaymentInput])
  readonly directTaxPayments!: DirectTaxPaymentInput[]

  @Allow()
  @Field({ nullable: true })
  readonly applicationSystemId?: string
}


import { Allow, ArrayMinSize, IsArray, IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { GraphQLJSONObject } from 'graphql-type-json'

import type {
  CreateApplication,
} from '@island.is/university-gateway/types'


import type { Gender, CreateDefendant } from '@island.is/judicial-system/types'

@InputType()
export class CreateDefendantInput implements CreateDefendant {
  @Allow()
  @Field()
  readonly caseId!: string

  @Allow()
  @Field({ nullable: true })
  readonly noNationalId?: boolean

  @Allow()
  @Field({ nullable: true })
  readonly nationalId?: string

  @Allow()
  @Field({ nullable: true })
  readonly name?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly gender?: Gender

  @Allow()
  @Field({ nullable: true })
  readonly address?: string

  @Allow()
  @Field({ nullable: true })
  readonly citizenship?: string
}


@InputType()
export class CreateApplicationInput implements CreateApplication {
  @Allow()
  @Field(() => String)
  readonly type!: CaseType

  @Allow()
  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly indictmentSubtypes?: IndictmentSubtypeMap

  @Allow()
  @Field({ nullable: true })
  readonly description?: string

  @Allow()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Field(() => [String])
  readonly policeCaseNumbers!: string[]

  @Allow()
  @Field({ nullable: true })
  readonly leadInvestigator?: string

  @Allow()
  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly crimeScenes?: CrimeSceneMap
}



import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator'
import { ModeOfDelivery } from '../../program/types'

export class CreateApplicationDto {
  @IsUUID()
  @ApiProperty({
    description: 'University ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  universityId!: string

  @IsUUID()
  @ApiProperty({
    description: 'Program ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  programId!: string

  @IsEnum(ModeOfDelivery)
  @ApiProperty({
    description: 'What mode of delivery was selected in the application',
    example: ModeOfDelivery.ON_SITE,
    enum: ModeOfDelivery,
  })
  modeOfDelivery!: ModeOfDelivery

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Extra data that should follow application',
    example: 'TBD',
  })
  @ApiPropertyOptional()
  extraData?: string
}
