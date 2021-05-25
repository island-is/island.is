import { IsNationalId } from '../validators/isNationalId.decorator'

export class FindOneDto {
  @IsNationalId()
  nationalId!: string
}
