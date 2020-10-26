import { Field, ObjectType } from '@nestjs/graphql'
import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
} from 'sequelize-typescript'
import { VehicleModel } from '../../vehicle/model/vehicle.model'

@ObjectType()
@Table({ tableName: 'recycling_request' })
export class RecyclingRequestModel extends Model<RecyclingRequestModel> {
  @Field()
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    allowNull: false,
  })
  id!: number

  @Field()
  @ForeignKey(() => VehicleModel)
  @Column({
    type: DataType.STRING,
  })
  vehicleId: string

  @BelongsTo(() => VehicleModel)
  vehicle: VehicleModel

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  requestType: string

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nameOfRequestor: string

  @Field()
  @CreatedAt
  @Column
  createdAt: Date

  @Field()
  @UpdatedAt
  @Column
  updatedAt: Date
}
