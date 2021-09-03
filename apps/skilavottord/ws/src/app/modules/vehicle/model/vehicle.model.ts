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
  AllowNull,
} from 'sequelize-typescript'
import { RecyclingRequestModel } from '../../recycling.request/model/recycling.request.model'
import { VehicleOwnerModel } from '../../vehicle.owner/model/vehicle.owner.model'
@ObjectType()
@Table({ tableName: 'vehicle' })
export class VehicleModel extends Model {
  @Field()
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  vehicleId: string

  //ATH
  @AllowNull(true)
  @ForeignKey(() => VehicleOwnerModel)
  @Column({
    type: DataType.STRING,
  })
  ownerNationalId!: string

  @BelongsTo(() => VehicleOwnerModel)
  vehicleOwner: VehicleOwnerModel

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  vehicleType: string

  @Field()
  @Column({
    type: DataType.STRING,
  })
  vehicleColor: string

  @Field()
  @Column({
    type: DataType.DATE,
  })
  newregDate: Date

  @Field()
  @Column({
    type: DataType.STRING,
  })
  vinNumber: string

  @Field()
  @CreatedAt
  @Column
  createdAt: Date

  @Field()
  @UpdatedAt
  @Column
  updatedAt: Date

  @Field(() => [RecyclingRequestModel], { nullable: true })
  @HasMany(() => RecyclingRequestModel)
  recyclingRequests!: RecyclingRequestModel[]
}
