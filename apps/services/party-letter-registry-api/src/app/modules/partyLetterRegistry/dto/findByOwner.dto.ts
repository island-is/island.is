import { IsNationalId } from '../validators/isNationalId.decorator'

export class FindByOwnerDto {
  @IsNationalId()
  owner!: string
}
