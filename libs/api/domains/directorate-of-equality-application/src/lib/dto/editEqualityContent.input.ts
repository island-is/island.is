import { Field, InputType } from '@nestjs/graphql'

/**
 * A revision to an already-submitted plan, during a case-worker-requested
 * correction.
 *
 * Same either/or shape as `UpdateEqualityDraftContentInput`, and the same
 * reason for both fields being optional. A correction may switch
 * representation: a plan first submitted as rich text can come back as a PDF,
 * and DMR replaces content and type together.
 */
@InputType('DirectorateOfEqualityEditEqualityContentInput')
export class EditEqualityContentInput {
  @Field(() => String)
  applicationId!: string

  /** Base64-encoded HTML. Sanitised here before it reaches DMR. */
  @Field(() => String, { nullable: true })
  equalityReportContent?: string

  /**
   * Base64-encoded PDF, forwarded byte-for-byte.
   *
   * ⚠️ **Never sanitised — see the service.** It is binary, not markup.
   */
  @Field(() => String, { nullable: true })
  equalityReportPdf?: string

  /** Required by DMR whenever `equalityReportPdf` is supplied. */
  @Field(() => String, { nullable: true })
  equalityReportPdfFilename?: string
}
