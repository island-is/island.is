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

import { Field, ID, InputType, Int } from '@nestjs/graphql'

@InputType()
export class UpdateFile {
  @Allow()
  @Field(() => ID)
  readonly id!: string

  @Allow()
  @IsOptional()
  @ValidateIf((file) => typeof file.orderWithinChapter === 'number')
  @IsNumber()
  @Min(0)
  @Field(() => Int, {
    nullable: true,
    description:
      'Number of chapter where file is in. 0 or greater. If provided, then order must also be provided.',
  })
  readonly chapter?: number

  @Allow()
  @IsOptional()
  @ValidateIf((file) => typeof file.chapter === 'number')
  @IsNumber()
  @Min(0)
  @Field(() => Int, {
    nullable: true,
    description:
      'Number indicating the order within chapter. 0 or greater. If provided, then chapter must also be provided.',
  })
  readonly orderWithinChapter?: number

  @Allow()
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly userGeneratedFilename?: string

  @Allow()
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  readonly displayDate?: string
}

@InputType()
export class UpdateFilesInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFile)
  @Field(() => [UpdateFile])
  readonly files!: UpdateFile[]
}
