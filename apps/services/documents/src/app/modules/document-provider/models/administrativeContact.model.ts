import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  AfterCreate,
  AfterUpdate,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { Organisation } from './organisation.model'
import { Changelog } from './changelog.model'
import { EntityTypes } from '../enums/EntityTypes'

@Table({ tableName: 'administrative_contact' })
export class AdministrativeContact extends Model {
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

  @BelongsTo(() => Organisation)
  // eslint-disable-next-line
  organisation!: any

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  name!: string

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
  static addChangelog(instance: AdministrativeContact) {
    const obj = {
      organisationId: instance.organisationId,
      entityId: instance.id,
      entityType: EntityTypes.ADMINISTRATIVE_CONTACT,
      data: instance,
    }

    Changelog.create(obj)
  }
}
