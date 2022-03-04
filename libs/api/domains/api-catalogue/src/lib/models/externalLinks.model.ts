import { Field, ObjectType } from '@nestjs/graphql'
import { ExternalLinks as IExternalLinks } from '@island.is/api-catalogue/types'
import { IsString } from 'class-validator'

@ObjectType()
export class ExternalLinks implements IExternalLinks {
  @Field((type) => String)
  @IsString()
  responsibleParty!: string

  @Field((type) => String)
  @IsString()
  documentation?: string | undefined

  @Field((type) => String)
  @IsString()
  bugReport?: string | undefined

  @Field((type) => String)
  @IsString()
  featureRequest?: string | undefined
}
