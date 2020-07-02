import { IsEnum, IsJSON, IsNotEmpty } from 'class-validator'
import {
  ApplicationSchemaType,
  ApplicationStates,
} from '../../../core/db/models/application.model'

export class ApplicationDto {
  @IsNotEmpty()
  @IsEnum(ApplicationSchemaType)
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
