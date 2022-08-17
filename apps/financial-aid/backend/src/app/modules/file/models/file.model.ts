import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'
import { Optional } from 'sequelize/types'

import { ApplicationFile, FileType } from '@island.is/financial-aid/shared/lib'

import { ApplicationModel } from '../../application/models/application.model'

interface ApplicationFileCreationAttributes
  extends Optional<ApplicationFile, 'id' | 'created'> {}

@Table({
  tableName: 'application_files',
  timestamps: false,
})
export class ApplicationFileModel extends Model<
  ApplicationFile,
  ApplicationFileCreationAttributes
> {
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
