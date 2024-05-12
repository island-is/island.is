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
  @IsOptional()
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
  @IsOptional()
  @Field(() => String, { nullable: true })
  @IsString()
  readonly userGeneratedFilename?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  @IsString()
  readonly displayDate?: string
}

@InputType()
export class UpdateFilesInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => [UpdateFile])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFile)
  readonly files!: UpdateFile[]
}
