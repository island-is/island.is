import { Field, ID, ObjectType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import { SystemMetadata } from '@island.is/shared/types'
import { IPowerBiSlice } from '../generated/contentfulTypes'

@ObjectType()
export class PowerBiSlice {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @Field(() => graphqlTypeJson, { nullable: true })
  powerBiEmbedProps?: Record<string, unknown>

  @Field({ nullable: true })
  workspaceId?: string

  @Field({ nullable: true })
  reportId?: string

  @Field({ nullable: true })
  owner?: 'Fiskistofa'
}

export const mapPowerBiSlice = ({
  fields,
  sys,
}: IPowerBiSlice): SystemMetadata<PowerBiSlice> => {
  return {
    typename: 'PowerBiSlice',
    id: sys.id,
    title: fields.title ?? '',
    powerBiEmbedProps: fields.config ?? null,
    workspaceId: fields.workSpaceId,
    reportId: fields.reportId,
    owner: fields.owner,
  }
}
