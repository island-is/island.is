import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  ForeignKey,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { ApplicationModel } from '../../application'

import {
  ApplicationEventType,
  ApplicationEvent,
} from '@island.is/financial-aid/shared/lib'

@Table({
  tableName: 'application_events',
  timestamps: false,
})
export class ApplicationEventModel extends Model<ApplicationEvent> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id: string

  @CreatedAt
  @Column({
    type: DataType.DATE,
  })
  @ApiProperty()
  created: Date

  @ForeignKey(() => ApplicationModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  @ApiProperty()
  applicationId: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(ApplicationEventType),
  })
  @ApiProperty({ enum: ApplicationEventType })
  eventType: ApplicationEventType

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  comment?: string
}
