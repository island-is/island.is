import { IsNotEmpty, IsString } from 'class-validator'

export class EstateDocumentParamsDto {
  @IsString()
  @IsNotEmpty()
  documentId!: string
}
