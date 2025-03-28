import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateVictimDto {
  @ApiPropertyOptional()
  name?: string

  @ApiPropertyOptional()
  hasNationalId?: boolean

  @ApiPropertyOptional()
  nationalId?: string

  @ApiPropertyOptional()
  hasLawyer?: boolean

  @ApiPropertyOptional()
  lawyerNationalId?: string

  @ApiPropertyOptional()
  lawyerName?: string

  @ApiPropertyOptional()
  lawyerEmail?: string

  @ApiPropertyOptional()
  lawyerPhoneNumber?: string

  @ApiPropertyOptional()
  lawyerAccessToRequest?: string
}
