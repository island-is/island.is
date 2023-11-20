import { ApiProperty } from '@nestjs/swagger'

import type {
  NewDiscount as TDiscount,
  AirDiscount as TAirDiscount,
  DiscountedFlight as TDiscountedFlight,
  DiscountedFlightLeg as TDiscountedFlightLeg,
} from '@island.is/air-discount-scheme/types'
import { User } from '../user/user.model'
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Optional } from 'sequelize/types'

interface AirDiscountCreationAttributes
  extends Optional<TAirDiscount, 'id' | 'active' | 'discountFlightId'> {}
@Table({ tableName: 'air_discount' })
export class AirDiscount
  extends Model<TAirDiscount, AirDiscountCreationAttributes>
  implements TAirDiscount
{
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code!: string

  @ForeignKey(() => DiscountedFlight)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  discountFlightId!: string

  @BelongsTo(() => DiscountedFlight)
  @ApiProperty({ type: () => DiscountedFlight })
  flight?: TDiscountedFlight

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  comment?: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  explicit!: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  employeeId?: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  active!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isConnectionCode!: boolean

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  validUntil!: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  usedAt?: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified!: Date
}

interface DiscountedFlightLegCreationAttributes
  extends Optional<TDiscountedFlightLeg, 'id' | 'discountFlightId'> {}
@Table({ tableName: 'discount_flight_leg' })
export class DiscountedFlightLeg
  extends Model<TDiscountedFlightLeg, DiscountedFlightLegCreationAttributes>
  implements TDiscountedFlightLeg
{
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @ForeignKey(() => DiscountedFlight)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  discountFlightId!: string

  @BelongsTo(() => DiscountedFlight)
  @ApiProperty({ type: () => DiscountedFlight })
  flight?: TDiscountedFlight

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  origin!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  destination!: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified!: Date
}

interface DiscountedFlightCreationAttributes
  extends Optional<Omit<TDiscountedFlight, 'flightLegs' | 'discount'>, 'id'> {
  flightLegs: DiscountedFlightLegCreationAttributes[]
  discount: AirDiscountCreationAttributes
}
@Table({ tableName: 'discount_flight' })
export class DiscountedFlight
  extends Model<TDiscountedFlight, DiscountedFlightCreationAttributes>
  implements TDiscountedFlight
{
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @ForeignKey(() => NewDiscount)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  discountId!: string

  @BelongsTo(() => NewDiscount)
  @ApiProperty({ type: () => NewDiscount })
  newDiscount?: TDiscount

  @HasMany(() => DiscountedFlightLeg)
  @ApiProperty({ type: () => [DiscountedFlightLeg], required: true })
  flightLegs!: [DiscountedFlightLeg]

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isConnectionFlight!: boolean

  @HasOne(() => AirDiscount)
  @ApiProperty({ type: () => AirDiscount, required: true })
  discount!: AirDiscount

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified!: Date
}

interface DiscountCreationAttributes
  extends Optional<Omit<TDiscount, 'discountedFlights'>, 'id'> {
  discountedFlights: DiscountedFlightCreationAttributes[]
}
@Table({ tableName: 'discount' })
export class NewDiscount
  extends Model<TDiscount, DiscountCreationAttributes>
  implements TDiscount
{
  @ApiProperty()
  user!: User

  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nationalId!: string

  @HasMany(() => DiscountedFlight)
  @ApiProperty({ type: () => [DiscountedFlight], required: true })
  discountedFlights!: DiscountedFlight[]

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  active!: boolean

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  usedAt?: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified!: Date
}
