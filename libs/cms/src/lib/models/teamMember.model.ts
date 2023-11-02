import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { ITeamMember } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'

@ObjectType()
export class TeamMember {
  @Field()
  name!: string

  @Field()
  title!: string

  @CacheField(() => Image)
  image!: Image

  @CacheField(() => Image, { nullable: true })
  imageOnSelect?: Image | null
}

export const mapTeamMember = ({ fields }: ITeamMember): TeamMember => ({
  name: fields.name ?? '',
  title: fields.title ?? '',
  image: mapImage(fields.mynd),
  imageOnSelect: fields.imageOnSelect ? mapImage(fields.imageOnSelect) : null,
})
