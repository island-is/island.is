import { IsUUID } from 'class-validator'

export class FindEndorsementListDto {
  @IsUUID(4)
  listId!: string
}
