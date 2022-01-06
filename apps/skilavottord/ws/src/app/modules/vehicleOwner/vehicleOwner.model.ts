import { Field, ObjectType } from '@nestjs/graphql'
import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript'

import { VehicleModel } from '../vehicle'

@ObjectType('VehicleOwner')
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
  @Column
  createdAt: Date

  @Field()
  @Column
  @UpdatedAt
  updatedAt: Date

  @Field(() => [VehicleModel], { nullable: true })
  @HasMany(() => VehicleModel)
  vehicles!: VehicleModel[]
}
