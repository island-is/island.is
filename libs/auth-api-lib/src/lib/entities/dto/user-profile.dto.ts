import { ApiPropertyOptional } from '@nestjs/swagger'
import { AddressDTO } from './address.dto'

export type GenderValue = 'male' | 'female' | 'non-binary'

export class UserProfileDTO {
  @ApiPropertyOptional()
  name?: string

  @ApiPropertyOptional()
  givenName?: string

  @ApiPropertyOptional()
  familyName?: string

  @ApiPropertyOptional()
  middleName?: string

  @ApiPropertyOptional()
  email?: string

  @ApiPropertyOptional()
  emailVerified?: boolean

  @ApiPropertyOptional()
  phoneNumber?: string

  @ApiPropertyOptional()
  phoneNumberVerified?: boolean

  @ApiPropertyOptional()
  gender?: GenderValue

  @ApiPropertyOptional()
  birthdate?: string

  @ApiPropertyOptional()
  picture?: string

  @ApiPropertyOptional()
  locale?: string

  @ApiPropertyOptional()
  address?: AddressDTO

  @ApiPropertyOptional()
  legalDomicile?: AddressDTO
}
