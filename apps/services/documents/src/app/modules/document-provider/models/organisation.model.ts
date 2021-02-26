import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  HasMany,
  HasOne,
} from 'sequelize-typescript'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Provider } from './provider.model'
import { TechnicalContact } from './technicalContact.model'
import { AdministrativeContact } from './administrativeContact.model'
import { Helpdesk } from './helpdesk.model'

@Table({
  tableName: 'organisation',
  indexes: [
    {
      fields: ['national_id'],
    },
  ],
})
export class Organisation extends Model<Organisation> {
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

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date
}
