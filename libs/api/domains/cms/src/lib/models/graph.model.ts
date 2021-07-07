import { Field, ObjectType } from '@nestjs/graphql'
import { IGraph } from '../generated/contentfulTypes'

@ObjectType()
export class Graph {
  @Field()
  title?: string

  @Field()
  data!: string

  @Field()
  datakeys!: string

  @Field()
  type?: string
}

export const mapGraph = ({ fields }: IGraph): Graph => {
  return {
    title: fields?.title ?? '',
    data: fields.data ? JSON.stringify(fields.data) : '',
    datakeys: fields.datakeys ? JSON.stringify(fields.datakeys) : '',
    type: fields?.type ?? '',
  }
}
