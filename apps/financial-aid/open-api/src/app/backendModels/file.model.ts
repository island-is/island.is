import { Optional } from 'sequelize/types'
import { Column, DataType, Model, Table } from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { ApplicationFile, FileType } from '@island.is/financial-aid/shared/lib'

interface ApplicationFileCreationAttributes
  extends Optional<ApplicationFile, 'id' | 'created'> {}

@Table({
  tableName: 'application_files',
  timestamps: false,
})
export class ApplicationFileBackendModel extends Model<
  ApplicationFile,
  ApplicationFileCreationAttributes
> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  name!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  key!: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(FileType),
  })
  @ApiProperty({ enum: FileType })
  type!: FileType
}
