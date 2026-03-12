import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class CardInformation {
  @ApiProperty({
    description: 'Card scheme (for example Visa or MasterCard)',
    type: String,
  })
  @IsString()
  cardScheme!: string

  @ApiPropertyOptional({
    description: 'Issuing country of the card',
    type: String,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  issuingCountry?: string | null = null

  @ApiPropertyOptional({
    description: 'Card usage description',
    type: String,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  cardUsage?: string | null = null

  @ApiPropertyOptional({
    description: 'Card category',
    type: String,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  cardCategory?: string | null = null

  @ApiPropertyOptional({
    description: 'Out-of-SCA scope status',
    type: Boolean,
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  outOfScaScope?: boolean | null = null
}
