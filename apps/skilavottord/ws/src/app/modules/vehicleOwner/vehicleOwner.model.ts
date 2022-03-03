import { Field, ObjectType } from '@nestjs/graphql'
import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
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
