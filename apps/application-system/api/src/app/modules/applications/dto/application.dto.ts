import { IsEnum, IsJSON, IsNotEmpty, IsString } from 'class-validator'
import { ApplicationStates } from '../../../core/db/models/application.model'

export class ApplicationDto {
  @IsNotEmpty()
  @IsString()
  // @IsIn(['example', 'example2'])  import allowed values from schema lib ?
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
