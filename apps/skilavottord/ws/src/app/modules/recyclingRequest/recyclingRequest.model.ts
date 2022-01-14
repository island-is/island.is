import {
  Field,
  ObjectType,
  createUnionType,
  registerEnumType,
} from '@nestjs/graphql'
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

import { RecyclingPartnerModel } from '../recyclingPartner'
import { VehicleModel } from '../vehicle'

export enum RecyclingRequestTypes {
  pendingRecycle = 'pendingRecycle',
  handOver = 'handOver',
  deregistered = 'deregistered',
  cancelled = 'cancelled',
  paymentInitiated = 'paymentInitiated',
  paymentFailed = 'paymentFailed',
}

registerEnumType(RecyclingRequestTypes, { name: 'RecyclingRequestTypes' })

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

export const RecyclingRequestResponse = createUnionType({
  name: 'RecyclingRequestResponse',
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

@ObjectType('RecyclingRequest')
@Table({ tableName: 'recycling_request' })
export class RecyclingRequestModel extends Model<RecyclingRequestModel> {
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
    field: 'vehicle_id',
  })
  vehicleId!: string

  @BelongsTo(() => VehicleModel)
  vehicle: VehicleModel

  @Field()
  @ForeignKey(() => RecyclingPartnerModel)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  recyclingPartnerId: string

  @Field(() => RecyclingPartnerModel)
  @BelongsTo(() => RecyclingPartnerModel)
  recyclingPartner: RecyclingPartnerModel

  @Field(() => RecyclingRequestTypes)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  requestType: RecyclingRequestTypes

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nameOfRequestor: string

  @Field({ nullable: true })
  @CreatedAt
  @Column({
    field: 'created_at',
  })
  createdAt?: Date

  @Field({ nullable: true })
  @UpdatedAt
  @Column({
    field: 'updated_at',
  })
  updatedAt?: Date
}
