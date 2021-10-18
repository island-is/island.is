import { Aid } from '@island.is/financial-aid/shared/lib'
import { ApiProperty } from '@nestjs/swagger'

export class MunicipalityResponse {
  @ApiProperty()
  id: String

  @ApiProperty()
  name: String

  @ApiProperty()
  municipalityId: String

  @ApiProperty()
  active: Boolean

  @ApiProperty()
  homepage: String

  @ApiProperty()
  individualAid: Aid

  @ApiProperty()
  cohabitationAid: Aid
}
