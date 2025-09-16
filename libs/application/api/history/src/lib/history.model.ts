import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
} from 'sequelize-typescript'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Application } from '@island.is/application/api/core'
@Table({
  tableName: 'state_history',
  timestamps: false,
  indexes: [
    {
      fields: ['application_id'],
    },
  ],
})
export class History extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @ApiProperty()
  entryTimestamp!: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  exitTimestamp?: Date

  @ApiProperty()
  @ForeignKey(() => Application)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  application_id!: Application['id']

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  stateKey!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  exitEvent?: string

  @ApiProperty()
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  previousState!: string

  @ApiPropertyOptional()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  exitEventSubjectNationalId?: string

  @ApiPropertyOptional()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  exitEventActorNationalId?: string
}
