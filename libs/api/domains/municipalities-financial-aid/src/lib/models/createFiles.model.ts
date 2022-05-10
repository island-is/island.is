import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('MunicipalitiesFinancialAidCreateFilesModel')
export class CreateFilesModel {
  @Field()
  readonly success!: boolean
}
