import { Field, ObjectType } from '@nestjs/graphql'
import { ApplicationFileModel } from './file.model'

@ObjectType('MunicipalitiesFinancialAidCreateFilesModel')
export class CreateFilesModel {
  @Field()
  readonly success!: boolean

  @Field(() => [ApplicationFileModel])
  readonly files!: ApplicationFileModel[]
}
