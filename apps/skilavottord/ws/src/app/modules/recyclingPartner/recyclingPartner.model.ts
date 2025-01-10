import { Field, ID, ObjectType } from '@nestjs/graphql'
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { RecyclingRequestModel } from '../recyclingRequest'
import { MunicipalityModel } from '../municipality/municipality.model'

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

  //alow null
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

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    field: 'is_municipality',
  })
  isMunicipality!: boolean

  @Field({ nullable: true }) // Ensure this field is nullable in GraphQL
  @Column({
    type: DataType.STRING,
    field: 'municipality_id',
    allowNull: true, // Ensure this field allows null in Sequelize
  })
  municipalityId?: string

  @Field(() => [RecyclingRequestModel])
  recyclingRequests?: typeof RecyclingRequestModel[]
  @Field(() => MunicipalityModel, { nullable: true })
  @BelongsTo(() => MunicipalityModel, {
    foreignKey: 'municipality_id',
    as: 'municipality',
  })
  municipality?: MunicipalityModel
}
