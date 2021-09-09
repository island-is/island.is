import { Column, DataType, Model, Table } from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import {
  HomeCircumstances,
  ApplicationState,
} from '@island.is/financial-aid/shared/lib'

@Table({
  tableName: 'applications',
  timestamps: true,
})
export class CurrentApplicationModel extends Model<CurrentApplicationModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id: string

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(HomeCircumstances),
  })
  @ApiProperty({ enum: HomeCircumstances })
  homeCircumstances: HomeCircumstances

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ApiProperty()
  usePersonalTaxCredit: boolean

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(ApplicationState),
  })
  @ApiProperty({ enum: ApplicationState })
  state: ApplicationState
}
