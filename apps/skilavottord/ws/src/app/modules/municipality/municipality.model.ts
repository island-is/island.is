import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Column, DataType, Model, Table } from 'sequelize-typescript'

@ObjectType('Municipality')
@Table({ tableName: 'municipality_view', timestamps: false })
export class MunicipalityModel extends Model<MunicipalityModel> {
  @Field(() => ID)
  @Column({
    type: DataType.STRING,
    field: 'id',
  })
  companyId!: string

  @Field()
  @Column({
    type: DataType.STRING,
    field: 'company_name',
  })
  companyName!: string
}
