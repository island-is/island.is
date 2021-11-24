import { CreateFilesResponse } from '@island.is/financial-aid/shared/lib'
import { ApiProperty } from '@nestjs/swagger'

export class CreateFilesModel implements CreateFilesResponse {
  @ApiProperty()
  success: boolean
}
