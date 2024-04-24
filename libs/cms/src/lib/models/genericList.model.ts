import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IGenericList } from '../generated/contentfulTypes'

@ObjectType()
export class GenericList {
  @Field(() => ID)
  id!: string
}

export const mapGenericList = ({ sys }: IGenericList): GenericList => ({
  id: sys.id,
})
