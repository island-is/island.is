import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { AddressDTO } from './address.dto'

export type GenderValue = 'male' | 'female' | 'non-binary'

export class UserProfileDTO {
  @ApiPropertyOptional({ type: String })
  name?: string | null

  @ApiPropertyOptional({ type: String })
  givenName?: string | null

  @ApiPropertyOptional({ type: String })
  familyName?: string | null

  @ApiPropertyOptional({ type: String })
  middleName?: string | null

  @ApiPropertyOptional({ type: String })
  email?: string | null

  @ApiPropertyOptional({ type: Boolean })
  emailVerified?: boolean | null

  @ApiPropertyOptional({ type: String })
  phoneNumber?: string | null

  @ApiPropertyOptional({ type: Boolean })
  phoneNumberVerified?: boolean | null

  @ApiPropertyOptional({ type: String })
  gender?: GenderValue | null

  @ApiPropertyOptional({ type: String })
  birthdate?: string | null

  @ApiPropertyOptional({ type: String })
  picture?: string | null

  @ApiPropertyOptional({ type: String })
  locale?: string | null

  @ApiPropertyOptional({ type: AddressDTO })
  address?: AddressDTO | null

  @ApiPropertyOptional({ type: AddressDTO })
  domicile?: AddressDTO | null
}
