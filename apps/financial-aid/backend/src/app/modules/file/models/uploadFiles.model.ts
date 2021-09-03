import { ApiProperty } from '@nestjs/swagger'

export class UploadFilesModel {
  @ApiProperty()
  success!: boolean
}
