import { IsUUID } from 'class-validator'

export class EndorsementDto {
  @IsUUID(4)
  listId!: string
}
