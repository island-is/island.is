import { Type } from 'class-transformer'
import {
  Allow,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator'

import { Field, InputType, Int } from '@nestjs/graphql'

import { UpdateFile as TUpdateFile } from '@island.is/judicial-system/types'

@InputType()
export class UpdateFile implements TUpdateFile {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field(() => Int, {
    nullable: true,
    description:
      'Number of chapter where file is in. 0 or greater. If provided, then order must also be provided.',
  })
  @ValidateIf((file) => typeof file.orderWithinChapter === 'number')
  @IsNumber()
  @Min(0)
  readonly chapter?: number

  @Allow()
  @Field(() => Int, {
    nullable: true,
    description:
      'Number indicating the order within chapter. 0 or greater. If provided, then chapter must also be provided.',
  })
  @ValidateIf((file) => typeof file.chapter === 'number')
  @IsNumber()
  @Min(0)
  readonly orderWithinChapter?: number

  @Allow()
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly userGeneratedFilename?: string

  @Allow()
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly displayDate?: string
}

@InputType()
export class UpdateFilesInput {
  @Allow()
  @Field()
  readonly caseId!: string

  @Allow()
  @Field(() => [UpdateFile])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFile)
  readonly files!: UpdateFile[]
}
