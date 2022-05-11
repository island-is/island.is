import { CreateFilesResponse } from '@island.is/financial-aid/shared/lib'
import { ApiProperty } from '@nestjs/swagger'
import { Model } from 'sequelize-typescript'
import { ApplicationFileModel } from './file.model'

export class CreateFilesModel extends Model<CreateFilesResponse> {
  @ApiProperty()
  success: boolean

  @ApiProperty({ type: ApplicationFileModel, isArray: true, nullable: true })
  files: ApplicationFileModel[]
}
