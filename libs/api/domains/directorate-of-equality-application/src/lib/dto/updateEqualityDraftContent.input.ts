import { Field, InputType } from '@nestjs/graphql'
import { MaxLength } from 'class-validator'

/**
 * The applicant's plan, pushed to DMR as they upload it.
 *
 * Exactly one of `equalityReportContent`, `equalityReportPdf` and
 * `equalityReportPdfKey` is expected — a plan is either rich text converted
 * from a .docx/.txt, or a PDF the company uploaded as-is, inline (kept for
 * browser tabs opened before the presigned path) or by presigned key. All are
 * optional here rather than modelled as a union
 * because GraphQL input unions do not exist; DMR enforces the either/or rule
 * and returns a 400 naming which case failed.
 */
@InputType('DirectorateOfEqualityUpdateEqualityDraftContentInput')
export class UpdateEqualityDraftContentInput {
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
