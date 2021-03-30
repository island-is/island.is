import { IsString, IsDate, IsNumber, IsOptional, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateIcelandicNameBody {
  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly name?: string

  @IsString()
  @IsOptional()
  @ApiProperty()
  @IsEnum(['ST', 'DR', 'MI', 'RST', 'RDR'])
  readonly type?: 'ST' | 'DR' | 'MI' | 'RST' | 'RDR'

  @IsString()
  @IsOptional()
  @ApiProperty()
  @IsEnum(['Haf', 'Sam'])
  readonly status?: 'Haf' | 'Sam'

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly description?: string

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly visible?: number

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiProperty()
  readonly verdictDate?: Date
}

export class CreateIcelandicNameBody {
  @IsString()
  @ApiProperty()
  readonly name!: string

  @IsString()
  @ApiProperty()
  @IsEnum(['ST', 'DR', 'MI', 'RST', 'RDR'])
  readonly type!: 'ST' | 'DR' | 'MI' | 'RST' | 'RDR'

  @IsString()
  @IsOptional()
  @ApiProperty()
  @IsEnum(['Haf', 'Sam'])
  readonly status?: 'Haf' | 'Sam'

  @IsString()
  @IsOptional()
  @ApiProperty()
  readonly description?: string

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  readonly visible?: number

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiProperty()
  readonly verdictDate?: Date
}
