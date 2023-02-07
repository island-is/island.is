import { IsJWT } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetEducationGraduationDocumentDto {
  @IsJWT()
  @ApiProperty()
  readonly __accessToken!: string
}
