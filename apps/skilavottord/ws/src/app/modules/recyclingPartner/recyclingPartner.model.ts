import { Field, ID, ObjectType } from '@nestjs/graphql'
import { isNullableType } from 'graphql'
import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  HasMany,
  PrimaryKey,
} from 'sequelize-typescript'

import { RecyclingRequestModel } from '../recyclingRequest'

@ObjectType('RecyclingPartner')
@Table({ tableName: 'recycling_partner' })
export class RecyclingPartnerModel extends Model<RecyclingPartnerModel> {
  @Field((_) => ID)
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    field: 'company_id',
  })
  companyId!: string

  @Field()
  @Column({
    type: DataType.STRING,
    field: 'company_name',
  })
  companyName!: string

  @Field()
  @Column({
    type: DataType.STRING,
  })
  address!: string

  @Field()
  @Column({
    type: DataType.STRING,
  })
  postnumber!: string

  @Field()
  @Column({
    type: DataType.STRING,
  })
  city!: string

  @Field({ nullable: true })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email!: string

  @Field({ nullable: true })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'national_id',
  })
  nationalId!: string

  @Field({ nullable: true })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  website?: string

  @Field()
  @Column({
    type: DataType.STRING,
  })
  phone!: string

  @Field()
  @Column({
    type: DataType.BOOLEAN,
  })
  active!: boolean

  @Field()
  @CreatedAt
  @Column({
    field: 'created_at',
  })
  createdAt: Date

  @Field()
  @UpdatedAt
  @Column({
    field: 'updated_at',
  })
  updatedAt: Date

  @Field(() => [RecyclingRequestModel])
  @HasMany(() => RecyclingRequestModel)
  recyclingRequests?: typeof RecyclingRequestModel[]
}
