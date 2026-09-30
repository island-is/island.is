import { Field, InputType } from '@nestjs/graphql'

/**
 * The applicant's plan, pushed to DMR as they upload it.
 *
 * Exactly one of `equalityReportContent` and `equalityReportPdf` is expected —
 * a plan is either rich text converted from a .docx/.txt, or a PDF the company
 * uploaded as-is. Both are optional here rather than modelled as a union
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

  /** Required by DMR whenever `equalityReportPdf` is supplied. */
  @Field(() => String, { nullable: true })
  equalityReportPdfFilename?: string
}
