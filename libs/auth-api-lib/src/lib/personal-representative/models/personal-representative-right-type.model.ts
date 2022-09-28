import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PersonalRepresentativeRight } from './personal-representative-right.model'
import { PersonalRepresentativeRightTypeDTO } from '../dto/personal-representative-right-type.dto'

@Table({
  tableName: 'personal_representative_right_type',
})
export class PersonalRepresentativeRightType extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  @ApiProperty()
  code!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  description!: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  validFrom?: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  validTo?: Date

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiPropertyOptional()
  readonly modified?: Date

  @ApiPropertyOptional({ type: () => [PersonalRepresentativeRight] })
  @HasMany(() => PersonalRepresentativeRight)
  rights?: PersonalRepresentativeRight[]

  toDTO(): PersonalRepresentativeRightTypeDTO {
    return {
      code: this.code,
      description: this.description,
      validFrom: this.validFrom,
      validTo: this.validTo,
    }
  }
}
