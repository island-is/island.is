import { Field, ObjectType, createUnionType } from '@nestjs/graphql'
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
export class RequestErrors {
  @Field()
  message: string

  @Field()
  operation: string
}

@ObjectType()
export class RequestStatus {
  @Field()
  status: boolean
}

export const RecyclingRequestUnion = createUnionType({
  name: 'RecyclingRequest',
  types: () => [RequestErrors, RequestStatus],
  resolveType(res) {
    if (res.status) {
      return RequestStatus
    }
    if (res.operation) {
      return RequestErrors
    }
    return null
  },
})

@ObjectType()
@Table({ tableName: 'recycling_request' })
export class RecyclingRequestModel extends Model {
  @Field()
  @IsUUID(4)
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column
  id: string

  @Field()
  @ForeignKey(() => VehicleModel)
  @Column({
    type: DataType.STRING,
  })
  vehicleId!: string

  @BelongsTo(() => VehicleModel)
  vehicle: any

  @Field({ nullable: true })
  @ForeignKey(() => RecyclingPartnerModel)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  recyclingPartnerId: string

  @Field({ nullable: true })
  @BelongsTo(() => RecyclingPartnerModel, { foreignKey: { allowNull: true } })
  recyclingParter: RecyclingPartnerModel

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
