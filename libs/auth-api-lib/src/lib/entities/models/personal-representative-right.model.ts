import {
  Column,
  DataType,
  Model,
  Table,
  PrimaryKey,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { PersonalRepresentative } from './personal-representative.model'
import { PersonalRepresentativeRightType } from './personal-representative-right-type.model'

@Table({
  tableName: 'personal_representative_right_type',
})
export class PersonalRepresentativeRight extends Model<PersonalRepresentativeRight> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  id!: string

  @ForeignKey(() => PersonalRepresentative)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  personalRepresentativeId!: string

  @ForeignKey(() => PersonalRepresentativeRightType)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  rightTypeCode!: string

  @BelongsTo(() => PersonalRepresentative)
  @ApiProperty()
  personalRepresentative?: PersonalRepresentative  

  @BelongsTo(() => PersonalRepresentativeRightType)
  @ApiProperty()
  rightType?: PersonalRepresentativeRightType  
}
