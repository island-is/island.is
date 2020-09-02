import { Field, ObjectType } from '@nestjs/graphql'
import { AdgerdirSlice } from './adgerdirSlices/adgerdirSlice.model'

@ObjectType()
export class AdgerdirFrontpage {
  @Field()
  id: string

  @Field()
  title: string

  @Field()
  description: string

  @Field({ nullable: true })
  content?: string

  @Field(() => [AdgerdirSlice])
  slices: Array<typeof AdgerdirSlice>
}
