import { Field, ObjectType } from '@nestjs/graphql'
import { ITeamMember } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'

@ObjectType()
export class TeamMember {
  @Field()
  name!: string

  @Field()
  title!: string

  @Field(() => Image)
  image!: Image
}

export const mapTeamMember = ({ fields }: ITeamMember): TeamMember => ({
  name: fields.name ?? '',
  title: fields.title ?? '',
  image: mapImage(fields.mynd),
})
