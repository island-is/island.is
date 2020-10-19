import { Field, ObjectType } from '@nestjs/graphql'
import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  HasMany,
  BelongsTo,
  HasOne,
} from 'sequelize-typescript'

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
  @ForeignKey(() => VehicleOwnerModel)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ownerNationalId!: string

  @BelongsTo(() => VehicleOwnerModel)
  vehicleOwner: any

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
  createdAt: Date

  @Field()
  @UpdatedAt
  updatedAt: Date

  //ATH
  // @HasOne(() => RecyclingRequestModel, {
  //   foreignKey: 'recycling_request',
  //   as: 'recycling_request',
  //   onDelete: 'CASCADE',
  // })
  // vehicle!: VehicleModel
}

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
  //ATH
  @BelongsTo(() => VehicleModel, 'vehicleId')
  vehicle!: VehicleModel
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
  createdAt: Date

  @Field()
  @UpdatedAt
  updatedAt: Date
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

  @Field()
  @CreatedAt
  createdAt: Date

  @Field()
  @UpdatedAt
  updatedAt: Date
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

  @Field()
  @CreatedAt
  createdAt: Date

  @Field()
  @UpdatedAt
  updatedAt: Date
}

export default [
  GdprModel,
  VehicleModel,
  VehicleOwnerModel,
  RecyclingRequestModel,
  RecyclingPartnerModel,
]
