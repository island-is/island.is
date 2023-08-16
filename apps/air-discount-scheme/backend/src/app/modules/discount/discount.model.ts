import { ApiProperty } from '@nestjs/swagger'

import {
  ConnectionDiscountCode,
  Discount as TDiscount,
  ExplicitCode as TExplicitCode,
} from '@island.is/air-discount-scheme/types'
import { User } from '../user/user.model'
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Optional } from 'sequelize/types'
import { Flight } from '../flight/flight.model'

import { ConnectionDiscountCode as GQLConnectionDiscountCode } from './connectionDiscountCode.model'

export class Discount implements TDiscount {
  constructor(
    user: User,
    discountCode: string,
    connectionDiscountCodes: ConnectionDiscountCode[],
    nationalId: string,
    ttl: number,
  ) {
    this.user = user
    this.discountCode = discountCode
    this.connectionDiscountCodes = connectionDiscountCodes
    this.nationalId = nationalId
    this.expiresIn = ttl
  }
  @ApiProperty()
  user: User

  @ApiProperty()
  discountCode: string

  @ApiProperty({ type: [GQLConnectionDiscountCode] })
  connectionDiscountCodes: ConnectionDiscountCode[]

  @ApiProperty()
  nationalId: string

  @ApiProperty()
  expiresIn: number
}

interface ExplicitCodeCreationAttributes
  extends Optional<TExplicitCode, 'id' | 'created' | 'modified' | 'flightId'> {}

@Table({ tableName: 'explicit_code' })
export class ExplicitCode
  extends Model<TExplicitCode, ExplicitCodeCreationAttributes>
  implements TExplicitCode
{
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @ForeignKey(() => Flight)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  flightId?: string

  @BelongsTo(() => Flight)
  flight?: Flight

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  employeeId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  customerId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  comment!: string

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified!: Date
}
