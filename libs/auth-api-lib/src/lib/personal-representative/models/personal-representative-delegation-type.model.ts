import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { PersonalRepresentative } from './personal-representative.model'
import { DelegationTypeModel } from '../../delegations/models/delegation-type.model'
import {
  type CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'

@Table({
  tableName: 'personal_representative_delegation_type',
  indexes: [
    {
      fields: ['personal_representative_id'],
    },
    {
      fields: ['delegation_type_id'],
    },
  ],
})
export class PersonalRepresentativeDelegationTypeModel extends Model<
  InferAttributes<PersonalRepresentativeDelegationTypeModel>,
  InferCreationAttributes<PersonalRepresentativeDelegationTypeModel>
> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: CreationOptional<string>

  @CreatedAt
  @ApiProperty()
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date

  @ForeignKey(() => PersonalRepresentative)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  personalRepresentativeId!: string

  @ForeignKey(() => DelegationTypeModel)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  delegationTypeId!: string

  @ApiProperty({
    type: () => PersonalRepresentative,
    required: true,
  })
  @BelongsTo(() => PersonalRepresentative)
  personalRepresentative?: PersonalRepresentative

  @ApiProperty({
    type: () => DelegationTypeModel,
    required: true,
  })
  @BelongsTo(() => DelegationTypeModel)
  delegationType?: DelegationTypeModel
}
