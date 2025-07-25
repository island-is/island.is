import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  HasMany,
  HasOne,
  AfterCreate,
  AfterUpdate,
} from 'sequelize-typescript'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Provider } from './provider.model'
import { TechnicalContact } from './technicalContact.model'
import { AdministrativeContact } from './administrativeContact.model'
import { Helpdesk } from './helpdesk.model'
import { Changelog } from './changelog.model'
import { EntityTypes } from '../enums/EntityTypes'

@Table({
  tableName: 'organisation',
  indexes: [
    {
      fields: ['national_id'],
    },
  ],
})
export class Organisation extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  @ApiProperty()
  nationalId!: string

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
  address?: string

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
  zendeskId?: string

  @HasMany(() => Provider)
  @ApiPropertyOptional({ type: [Provider] })
  providers?: Provider[]

  @HasOne(() => AdministrativeContact)
  @ApiPropertyOptional()
  administrativeContact?: AdministrativeContact

  @HasOne(() => TechnicalContact)
  @ApiPropertyOptional()
  technicalContact?: TechnicalContact

  @HasOne(() => Helpdesk)
  @ApiPropertyOptional()
  helpdesk?: Helpdesk

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
  static addChangelog(instance: Organisation) {
    const obj = {
      organisationId: instance.id,
      entityId: instance.id,
      entityType: EntityTypes.ORGANISATION,
      data: instance,
    }

    Changelog.create(obj)
  }
}
