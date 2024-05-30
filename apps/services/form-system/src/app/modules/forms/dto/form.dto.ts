import { Step } from '../../steps/step.model'
import { ApiProperty } from '@nestjs/swagger'

export class FormDto {
  @ApiProperty()
  id!: number

  @ApiProperty()
  guid!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  invalidationDate?: Date

  @ApiProperty()
  created!: Date

  @ApiProperty()
  modified!: Date

  @ApiProperty()
  isTranslated!: boolean

  @ApiProperty()
  applicationDaysToRemove!: number

  @ApiProperty()
  derivedFrom!: number

  @ApiProperty()
  stopProgressOnValidatingStep!: boolean

  @ApiProperty()
  completedMessage?: string

  @ApiProperty()
  steps?: Step[]
}
