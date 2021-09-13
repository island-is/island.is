import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import {
  CreateApplicationFile,
  FileType,
} from '@island.is/financial-aid/shared/lib'

@InputType()
export class CreateApplicationFileInput implements CreateApplicationFile {
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
