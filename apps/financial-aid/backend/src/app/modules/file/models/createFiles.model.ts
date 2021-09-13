import { CreateFilesResponse } from '@island.is/financial-aid/shared'
import { ApiProperty } from '@nestjs/swagger'

export class CreateFilesModel implements CreateFilesResponse {
  @ApiProperty()
  success: boolean
}
