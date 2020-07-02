import { IsEnum, IsJSON, IsNotEmpty, IsString, IsIn } from 'class-validator'
import { ApplicationStates } from '../../../core/db/models/application.model'
import { schemaTypes } from '@island.is/application/schema'

export class ApplicationDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(Object.keys(schemaTypes))
  readonly typeId: string

  @IsNotEmpty()
  readonly applicant: string

  @IsNotEmpty()
  @IsEnum(ApplicationStates)
  readonly state: string

  @IsNotEmpty()
  @IsJSON()
  readonly answers: object
}
