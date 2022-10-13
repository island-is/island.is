import { Field, InputType, Int } from '@nestjs/graphql'
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator'

import { UpdateFile as TUpdateFile } from '@island.is/judicial-system/types'

@InputType()
export class UpdateFile implements TUpdateFile {
  @Field()
  readonly id!: string

  @Field(() => Int, { nullable: true })
  @ValidateIf((file) => typeof file.orderWithinChapter === 'number')
  @IsNumber()
  @IsPositive()
  readonly chapter?: number

  @Field(() => Int, { nullable: true })
  @ValidateIf((file) => typeof file.chapter === 'number')
  @IsNumber()
  @IsPositive()
  readonly orderWithinChapter?: number

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly userGeneratedFilename?: string
}

@InputType()
export class UpdateFilesInput {
  @Field()
  readonly caseId!: string

  @Field(() => [UpdateFile])
  readonly files!: UpdateFile[]
}
