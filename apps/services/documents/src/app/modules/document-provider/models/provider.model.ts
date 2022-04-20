import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  ForeignKey,
  AfterCreate,
  AfterUpdate,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { Organisation } from './organisation.model'
import { EntityTypes } from '../enums/EntityTypes'
import { Changelog } from './changelog.model'

@Table({ tableName: 'provider' })
export class Provider extends Model {
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
    allowNull: true,
  })
  @ApiProperty()
  endpoint?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  endpointType?: string

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  apiScope?: string

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  modifiedBy?: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  xroad!: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  @ApiProperty()
  externalProviderId?: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date

  @AfterCreate
  @AfterUpdate
  static addChangelog(instance: Provider) {
    const obj = {
      organisationId: instance.organisationId,
      entityId: instance.id,
      entityType: EntityTypes.PROVIDER,
      data: instance,
    }

    Changelog.create(obj)
  }
}
