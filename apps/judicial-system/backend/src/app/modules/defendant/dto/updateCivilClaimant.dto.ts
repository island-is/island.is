import { Transform } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
} from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import { nationalIdTransformer } from '../../../transformers'

export class UpdateCivilClaimantDto {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly noNationalId?: boolean

  @IsOptional()
  @IsString()
  @Length(10, 10)
  @Transform(nationalIdTransformer)
  @ApiPropertyOptional({ type: String })
  readonly nationalId?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly name?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly hasSpokesperson?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly spokespersonIsLawyer?: boolean

  @IsOptional()
  @IsString()
  @Length(10, 10)
  @Transform(nationalIdTransformer)
  @ApiPropertyOptional({ type: String })
  readonly spokespersonNationalId?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly spokespersonName?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly spokespersonEmail?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly spokespersonPhoneNumber?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly caseFilesSharedWithSpokesperson?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly isSpokespersonConfirmed?: boolean

  /**********
   * The appeal proceeding's advocate, which the court of appeals settles for
   * itself. Mirrors the district court fields above and is never written back
   * to them - a claimant represented at the district court may go
   * unrepresented on appeal, and the other way round.
   **********/
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly hasAppealSpokesperson?: boolean

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly appealSpokespersonIsLawyer?: boolean

  @IsOptional()
  @IsString()
  @Length(10, 10)
  @Transform(nationalIdTransformer)
  @ApiPropertyOptional({ type: String })
  readonly appealSpokespersonNationalId?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly appealSpokespersonName?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly appealSpokespersonEmail?: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String })
  readonly appealSpokespersonPhoneNumber?: string

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  readonly isAppealSpokespersonConfirmed?: boolean

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({ type: String, isArray: true })
  readonly policeCaseNumbers?: string[]

  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  @ApiPropertyOptional({ type: String, isArray: true })
  readonly defendantIds?: string[]
}
