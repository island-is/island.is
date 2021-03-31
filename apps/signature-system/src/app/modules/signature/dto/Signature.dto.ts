import { IsUUID } from 'class-validator'

export class SignatureDto {
  @IsUUID(4)
  listId!: string
}
