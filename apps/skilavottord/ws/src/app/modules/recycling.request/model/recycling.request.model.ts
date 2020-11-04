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
  HasMany,
} from 'sequelize-typescript'
import { RecyclingPartnerModel } from '../../recycling.partner/model/recycling.partner.model'
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
  vehicle: any

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

  //TODO in progress
  @ForeignKey(() => RecyclingPartnerModel)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  recyclingPartnerId!: string

  @BelongsTo(() => RecyclingPartnerModel)
  recyclingParter: any
}
