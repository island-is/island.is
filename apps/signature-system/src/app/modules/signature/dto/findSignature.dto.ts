import { IsOptional, IsUUID } from 'class-validator'

export class FindSignatureDto {
  @IsOptional()
  @IsUUID(4)
  listId?: string
}
