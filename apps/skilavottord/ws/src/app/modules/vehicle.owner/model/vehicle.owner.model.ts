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
import { VehicleModel } from '../../vehicle/model/vehicle.model'

@ObjectType()
@Table({ tableName: 'vehicle_owner' })
export class VehicleOwnerModel extends Model<VehicleOwnerModel> {
  @Field()
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  nationalId: string

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  personname: string

  @Field()
  @CreatedAt
  createdAt: Date

  @Field()
  @UpdatedAt
  updatedAt: Date

  @HasMany(() => VehicleModel)
  vehicles!: VehicleModel[]

  // //ATH
  // @Field((type) => [VehicleModel])
  // @HasMany(() => VehicleModel)
  // vehicle: VehicleModel[]
}
