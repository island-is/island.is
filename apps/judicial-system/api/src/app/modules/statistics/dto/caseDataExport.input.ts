import { Allow, IsOptional } from 'class-validator'

import { Field, InputType, registerEnumType } from '@nestjs/graphql'

import { DataGroups } from '@island.is/judicial-system/types'

import { DateFilter } from './caseStatistics.input'

registerEnumType(DataGroups, { name: 'DataGroups' })

@InputType()
export class CaseDataExportInput {
  @Allow()
  @Field(() => DataGroups)
  readonly type!: DataGroups

  @Allow()
  @IsOptional()
  @Field(() => DateFilter, { nullable: true })
  readonly period?: DateFilter
}
