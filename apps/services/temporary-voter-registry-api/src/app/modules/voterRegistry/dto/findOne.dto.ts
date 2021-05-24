import { IsNationalId } from '@island.is/shared/nestjs'

export class FindOneDto {
  @IsNationalId()
  nationalId!: string
}
