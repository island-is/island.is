import { IsNationalId } from '@island.is/shared/nestjs'

export class FindByManagerDto {
  @IsNationalId()
  manager!: string
}
