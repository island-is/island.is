import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('IntellectualPropertiesApplicationLifecycle')
export class ApplicationLifecycle {
  @Field(() => Date, { nullable: true })
  createDate?: Date

  @Field(() => Date, { nullable: true })
  applicationDate?: Date

  @Field(() => Date, { nullable: true })
  applicationDateAvailable?: Date

  @Field(() => Date, { nullable: true })
  applicationDatePublishedAsAvailable?: Date

  @Field(() => Date, { nullable: true })
  applicationDeadlineDate?: Date

  @Field(() => Date, { nullable: true })
  internationalRegistrationDate?: Date

  @Field(() => Date, { nullable: true })
  registrationDate?: Date

  @Field(() => Date, { nullable: true })
  maxValidObjectionDate?: Date

  @Field(() => Date, { nullable: true })
  maxValidDate?: Date

  @Field(() => Date, { nullable: true })
  publishDate?: Date

  @Field(() => Date, { nullable: true })
  lastModified?: Date

  @Field(() => Date, { nullable: true })
  announcementDate?: Date

  @Field(() => Date, { nullable: true })
  expiryDate?: Date

  @Field(() => Date, { nullable: true })
  unregistrationDate?: Date

  @Field(() => Date, { nullable: true })
  renewalDate?: Date
}
