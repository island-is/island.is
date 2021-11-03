import { ApiProperty } from '@nestjs/swagger'
import { AidModel } from '../../aid'

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
  individualAid: AidModel

  @ApiProperty()
  cohabitationAid: AidModel

  @ApiProperty()
  rulesHomepage: string
}
