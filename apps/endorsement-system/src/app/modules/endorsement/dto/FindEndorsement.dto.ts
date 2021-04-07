import { IsOptional, IsUUID } from 'class-validator'

export class FindEndorsementDto {
  @IsOptional()
  @IsUUID(4)
  listId?: string
}
