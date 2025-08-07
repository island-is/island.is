import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('VehiclesDownloadServiceUrls')
export class DownloadServiceUrls {
  @Field(() => String)
  excel!: string

  @Field(() => String)
  pdf!: string
}
