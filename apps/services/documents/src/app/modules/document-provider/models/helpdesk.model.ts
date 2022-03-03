import { ApiProperty } from '@nestjs/swagger'
import {
  AfterCreate,
  AfterUpdate,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { EntityTypes } from '../enums/EntityTypes'

import { Changelog } from './changelog.model'
import { Organisation } from './organisation.model'

@Table({ tableName: 'helpdesk' })
export class Helpdesk extends Model<Helpdesk> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @ForeignKey(() => Organisation)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  organisationId!: string

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  email?: string

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  phoneNumber?: string

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  modifiedBy?: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date

  @AfterCreate
  @AfterUpdate
  static addChangelog(instance: Helpdesk) {
    const obj = {
      organisationId: instance.organisationId,
      entityId: instance.id,
      entityType: EntityTypes.HELPDESK,
      data: instance,
    }

    Changelog.create(obj)
  }
}
