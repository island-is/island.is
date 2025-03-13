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

import { RecyclingPartnerModel } from '../recyclingPartner'
import { Role } from '../auth'

export const { citizen, ...AccessControlRole } = Role
export type AccessControlRoleType = Exclude<Role, typeof Role.citizen>

registerEnumType(AccessControlRole, { name: 'AccessControlRole' })

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

  @Field(() => AccessControlRole)
  @Column({
    type: DataType.STRING,
  })
  role!: AccessControlRoleType

  @Field({ nullable: true })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email!: string

  @Field({ nullable: true })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone!: string

  @Field({ nullable: true })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'recycling_location',
  })
  recyclingLocation?: string

  @Field({ nullable: true })
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
