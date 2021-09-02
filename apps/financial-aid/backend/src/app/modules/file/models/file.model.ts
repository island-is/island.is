import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { ApplicationModel } from '../../application'
import { FileType } from '@island.is/financial-aid/shared'

@Table({
  tableName: 'application_files',
  timestamps: false,
})
export class ApplicationFileModel extends Model<ApplicationFileModel> {
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
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  name: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  key: string

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty()
  size: number

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(FileType),
  })
  @ApiProperty({ enum: FileType })
  type: FileType
}
