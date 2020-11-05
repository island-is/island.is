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
  IsUUID,
  PrimaryKey,
  Default,
} from 'sequelize-typescript'
import { RecyclingPartnerModel } from '../../recycling.partner/model/recycling.partner.model'
import { VehicleModel } from '../../vehicle/model/vehicle.model'

@ObjectType()
@Table({ tableName: 'recycling_request' })
export class RecyclingRequestModel extends Model<RecyclingRequestModel> {
  @Field()
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string

  // @Field()
  // @Column({
  //   type: DataType.UUID,
  //   primaryKey: true,
  //   allowNull: false,
  //   defaultValue: DataTypeUIDV4,
  // })
  // id!: string

  @Field()
  @ForeignKey(() => VehicleModel)
  @Column({
    type: DataType.STRING,
  })
  vehicleId!: string

  @BelongsTo(() => VehicleModel)
  vehicle: any

  @Field()
  @ForeignKey(() => RecyclingPartnerModel)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  recyclingPartnerId!: string

  @BelongsTo(() => RecyclingPartnerModel)
  recyclingParter: any

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
