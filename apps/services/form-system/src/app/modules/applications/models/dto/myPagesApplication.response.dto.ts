import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import {
  IsDate,
  IsNumber,
  IsObject,
  IsString,
  IsArray,
  IsBoolean,
} from 'class-validator'

class ActionCardTag {
  @ApiPropertyOptional()
  @Expose()
  @IsString()
  label?: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  variant?: string
}

class PendingAction {
  @ApiPropertyOptional()
  @Expose()
  @IsString()
  displayStatus?: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  content?: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  button?: string
}

class History {
  @ApiProperty()
  @Expose()
  @IsDate()
  date!: Date

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  log?: string
}

class ActionCardMetaData {
  @ApiPropertyOptional()
  @Expose()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  description?: string

  @ApiPropertyOptional()
  @Expose()
  @IsObject()
  tag?: ActionCardTag

  @ApiPropertyOptional()
  @Expose()
  @IsBoolean()
  deleteButton?: boolean

  @ApiPropertyOptional()
  @Expose()
  @IsObject()
  pendingAction?: PendingAction

  @IsArray()
  @Expose()
  @Type(() => History)
  @ApiPropertyOptional({ type: [History], default: [] })
  history?: History[]

  @ApiPropertyOptional()
  @Expose()
  @IsNumber()
  draftFinishedSteps?: number

  @ApiPropertyOptional()
  @Expose()
  @IsNumber()
  draftTotalSteps?: number

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  historyButton?: string
}

export class MyPagesApplicationResponseDto {
  @ApiProperty()
  @Expose()
  @IsString()
  id!: string

  @ApiProperty()
  @Expose()
  @IsDate()
  created!: Date

  @ApiProperty()
  @Expose()
  @IsDate()
  modified!: Date

  @ApiProperty()
  @Expose()
  @IsString()
  applicant!: string

  @ApiProperty()
  @Expose()
  @IsArray()
  assignees!: string[]

  @ApiProperty()
  @Expose()
  @IsArray()
  applicantActors!: string[]

  @ApiProperty()
  @Expose()
  @IsString()
  state!: string

  @ApiPropertyOptional()
  @Expose()
  @IsObject()
  actionCard?: ActionCardMetaData

  @ApiPropertyOptional()
  @Expose()
  @IsObject()
  attachments?: object

  @ApiProperty()
  @Expose()
  @IsString()
  typeId!: string

  @ApiProperty()
  @Expose()
  @IsObject()
  answers!: object

  @ApiProperty()
  @Expose()
  @IsObject()
  externalData!: object

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  name?: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  institution?: string

  @ApiPropertyOptional()
  @Expose()
  @IsNumber()
  progress?: number

  @ApiProperty()
  @Expose()
  @IsString()
  status!: string

  @ApiPropertyOptional()
  @Expose()
  @IsBoolean()
  pruned?: boolean

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  formSystemFormSlug?: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  formSystemOrgSlug?: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  formSystemOrgContentfulId?: string
}
