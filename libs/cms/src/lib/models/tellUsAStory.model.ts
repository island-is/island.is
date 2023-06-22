import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { ITellUsAStory } from '../generated/contentfulTypes'
import { Html, mapHtml } from './html.model'
import { Image, mapImage } from './image.model'

@ObjectType()
export class TellUsAStory {
  @Field(() => ID)
  id!: string

  @Field()
  introTitle!: string

  @CacheField(() => Html, { nullable: true })
  introDescription!: Html

  @CacheField(() => Image, { nullable: true })
  introImage?: Image | null

  @Field()
  firstSectionTitle!: string

  @Field()
  organizationLabel!: string

  @Field()
  organizationPlaceholder!: string

  @Field()
  organizationInputErrorMessage!: string

  @Field()
  dateOfStoryLabel!: string

  @Field()
  dateOfStoryPlaceholder!: string

  @Field()
  dateOfStoryInputErrorMessage!: string

  @Field()
  secondSectionTitle!: string

  @Field()
  subjectLabel!: string

  @Field()
  subjectPlaceholder!: string

  @Field({ nullable: true })
  subjectInputErrorMessage?: string

  @Field()
  messageLabel!: string

  @Field()
  messagePlaceholder!: string

  @Field()
  messageInputErrorMessage!: string

  @Field()
  thirdSectionTitle!: string

  @CacheField(() => Html, { nullable: true })
  instructionsDescription!: Html

  @Field()
  instructionsImage!: Image

  @Field()
  instructionsTitle!: string

  @Field()
  nameLabel!: string

  @Field()
  namePlaceholder!: string

  @Field()
  nameInputErrorMessage!: string

  @Field()
  emailLabel!: string

  @Field()
  emailPlaceholder!: string

  @Field()
  emailInputErrorMessage!: string

  @Field()
  publicationAllowedLabel!: string

  @Field()
  submitButtonTitle!: string

  @Field()
  SuccessMessageTitle!: string

  @CacheField(() => Html, { nullable: true })
  successMessage!: Html

  @Field()
  errorMessageTitle!: string

  @CacheField(() => Html, { nullable: true })
  errorMessage!: Html
}

export const mapTellUsAStory = ({
  fields,
  sys,
}: ITellUsAStory): SystemMetadata<TellUsAStory> => ({
  typename: 'TellUsAStory',
  id: sys.id,
  introTitle: fields.introTitle ?? '',
  introDescription:
    (fields.introDescription &&
      mapHtml(fields.introDescription, sys.id + ':introDescription')) ??
    null,
  introImage: fields.introImage ? mapImage(fields.introImage) : null,
  instructionsTitle: fields.instructionsTitle ?? '',
  firstSectionTitle: fields.firstSectionTitle ?? '',
  organizationLabel: fields.organizationLabel ?? '',
  organizationPlaceholder: fields.organizationPlaceholder ?? '',
  organizationInputErrorMessage: fields.organizationInputErrorMessage ?? '',
  dateOfStoryLabel: fields.dateOfStoryLabel ?? '',
  dateOfStoryPlaceholder: fields.dateOfStoryPlaceholder ?? '',
  dateOfStoryInputErrorMessage: fields.dateOfStoryInputErrorMessage ?? '',
  secondSectionTitle: fields.secondSectionTitle ?? '',
  subjectLabel: fields.subjectLabel ?? '',
  subjectPlaceholder: fields.subjectPlaceholder ?? '',
  subjectInputErrorMessage: fields.subjectInputErrorMessage ?? '',
  messageLabel: fields.messageLabel ?? '',
  messagePlaceholder: fields.messagePlaceholder ?? '',
  messageInputErrorMessage: fields.messageInputErrorMessage ?? '',
  thirdSectionTitle: fields.thirdSectionTitle ?? '',
  instructionsDescription:
    (fields.instructionsDescription &&
      mapHtml(
        fields.instructionsDescription,
        sys.id + ':instructionsDescription',
      )) ??
    null,
  instructionsImage: mapImage(fields.instructionsImage),
  nameLabel: fields.nameLabel ?? '',
  namePlaceholder: fields.namePlaceholder ?? '',
  nameInputErrorMessage: fields.nameInputErrorMessage ?? '',
  emailLabel: fields.emailLabel ?? '',
  emailPlaceholder: fields.emailPlaceholder ?? '',
  emailInputErrorMessage: fields.emailInputErrorMessage ?? '',
  publicationAllowedLabel: fields.publicationAllowedLabel ?? '',
  submitButtonTitle: fields.submitButtonTitle ?? '',
  SuccessMessageTitle: fields.SuccessMessageTitle ?? '',
  successMessage:
    (fields.successMessage &&
      mapHtml(fields.successMessage, sys.id + ':successMessage')) ??
    null,
  errorMessageTitle: fields.errorMessageTitle ?? '',
  errorMessage:
    (fields.errorMessage &&
      mapHtml(fields.errorMessage, sys.id + ':errorMessage')) ??
    null,
})
