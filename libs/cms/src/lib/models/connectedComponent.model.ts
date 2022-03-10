import { Field, ID, ObjectType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import {
  ISliceConnectedComponent,
  ISliceConnectedComponentFields,
} from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class ConnectedComponent {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  type?: string

  // This is a temporary field while we are trying out the first connected component (which
  // should ideally handle its own data fetching) to get data from contentful in case we can't
  // fetch it from the API and also to quickly change the graphql endpoint for the data.
  @Field(() => graphqlTypeJson, { nullable: true })
  json?: Record<string, any> | null
}

const parseJson = (fields: ISliceConnectedComponentFields) => {
  const json = fields?.json ?? null

  if (!json) return null

  switch (fields.type) {
    case 'Skilavottord/CompanyListConnected':
      if (typeof json === 'object' && Object.keys(json).length) {
        return {
          graphqlLink: json.graphqlLink,
        }
      }

      break
    case 'Skilavottord/CompanyList':
      if (Array.isArray(json)) {
        return json.map((x) => ({
          address: x.address ?? '',
          postnumber: x.postnumber ?? '',
          city: x.city ?? '',
          phone: x.phone ?? '',
          website: x.website ?? '',
          companyName: x.companyName ?? '',
        }))
      }

      break
    default:
      break
  }

  return json
}

export const mapConnectedComponent = ({
  fields,
  sys,
}: ISliceConnectedComponent): SystemMetadata<ConnectedComponent> => ({
  typename: 'ConnectedComponent',
  id: sys.id,
  title: fields?.title ?? '',
  type: fields?.type ?? 'None',
  json: fields?.json ? parseJson(fields) : null,
})
