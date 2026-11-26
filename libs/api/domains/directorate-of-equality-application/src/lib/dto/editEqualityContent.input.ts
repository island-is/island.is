import { Field, InputType } from '@nestjs/graphql'
import { MaxLength } from 'class-validator'

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

  /** Required by DMR whenever `equalityReportPdf` or `equalityReportPdfKey` is supplied. */
  @Field(() => String, { nullable: true })
  equalityReportPdfFilename?: string

  /**
   * Key from `directorateOfEqualityPresignEqualityPlan` for a PDF the browser
   * already PUT to S3; the bytes never pass through here. Single use: DMR
   * consumes the upload on success and refuses the key after that.
   */
  @Field(() => String, { nullable: true })
  @MaxLength(256)
  equalityReportPdfKey?: string
}
