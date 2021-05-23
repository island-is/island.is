import { IsNationalId } from '@island.is/shared/nestjs'

export class FindByOwnerDto {
  @IsNationalId()
  owner!: string
}
