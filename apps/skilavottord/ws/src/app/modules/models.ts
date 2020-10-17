import { Field, ObjectType } from '@nestjs/graphql'
import {
  Column,
  CreatedAt,
  DataType,
  IsDate,
  Model,
  Table,
  UpdatedAt,
  ForeignKey,
  HasMany,
  HasOne,
  BelongsTo,
} from 'sequelize-typescript'

@ObjectType()
@Table({ tableName: 'vehicleowner' })
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

  //ATH
  @Field(type => [VehicleModel])
  @HasMany(() => VehicleModel)
  vehicle!: VehicleModel[]
}

@ObjectType()
@Table({ tableName: 'vehicle' })
export class VehicleModel extends Model<VehicleModel> {
  @Field()
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  vehicleId: string

  //ATH
  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ForeignKey(() => VehicleOwnerModel)
  carOwnerId!: string

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
}

@ObjectType()
@Table({ tableName: 'recycling_request' })
export class RecyclingRequestModel extends Model<RecyclingRequestModel> {
  @Field()
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  vehicleId: string

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

  //ATH
  @BelongsTo(() => VehicleModel)
  vehicle!: VehicleModel
}


@ObjectType()
@Table({ tableName: 'gdpr' })
export class GdprModel extends Model<GdprModel> {
  @Field()
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  nationalId: string

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  gdprStatus: boolean
}


@ObjectType()
@Table({ tableName: 'recycling_partner' })
export class RecyclingPartnerModel extends Model<RecyclingPartnerModel> {
  @Field()
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  companyId: string

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  companyName: string

  @Field()
  @Column({
    type: DataType.STRING,
  })
  address: string

  @Field()
  @Column({
    type: DataType.STRING,
  })
  postnumber: string

  @Field()
  @Column({
    type: DataType.STRING,
  })
  city: string

  @Field()
  @Column({
    type: DataType.STRING,
  })
  website: string

  @Field()
  @Column({
    type: DataType.STRING,
  })
  phone: string

  @Field()
  @Column({
    type: DataType.BOOLEAN,
  })
  active: boolean
}

export default [GdprModel, VehicleModel, VehicleOwnerModel, RecyclingRequestModel, RecyclingPartnerModel]
