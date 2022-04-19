import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { FileType } from '@island.is/financial-aid/shared/lib'

@InputType('MunicipalitiesFinancialAidCreateFileInput')
export class CreateFileInput {
  @Allow()
  @Field()
  readonly name!: string

  @Allow()
  @Field()
  readonly key!: string

  @Allow()
  @Field()
  readonly size!: number

  @Allow()
  @Field(() => String)
  readonly type!: FileType
}
