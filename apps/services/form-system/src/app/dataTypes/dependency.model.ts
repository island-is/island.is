import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsNotEmpty, IsUUID } from 'class-validator'
import { UUIDV4 } from 'sequelize'

export class Dependency {
  @IsNotEmpty()
  @IsUUID()
  @Type(() => UUIDV4)
  @ApiProperty({ type: String })
  parentProp!: string

  @IsNotEmpty()
  @IsArray()
  @IsUUID(undefined, { each: true })
  @Type(() => UUIDV4)
  @ApiProperty({ type: [String] })
  childProps!: string[]

  @IsNotEmpty()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ type: Boolean })
  isSelected!: boolean
}
