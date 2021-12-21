import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'

import { Role } from '../user'
import { RecyclingPartnerModel } from '../recyclingPartner'

@ObjectType('AccessControl')
@Table({ tableName: 'access_control', timestamps: false })
export class AccessControlModel extends Model<AccessControlModel> {
  @Field((_) => ID)
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    field: 'national_id',
  })
  nationalId!: string

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string

  @Field(() => Role)
  @Column({
    type: DataType.STRING,
  })
  role!: Role

  @ForeignKey(() => RecyclingPartnerModel)
  @Column({
    type: DataType.STRING,
    field: 'partner_id',
    allowNull: true,
  })
  partnerId?: string

  @Field(() => RecyclingPartnerModel, { nullable: true })
  @BelongsTo(() => RecyclingPartnerModel)
  recyclingPartner?: RecyclingPartnerModel
}
