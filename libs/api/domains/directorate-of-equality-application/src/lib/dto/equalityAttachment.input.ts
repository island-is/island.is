import { Field, InputType } from '@nestjs/graphql'
import { IsUUID, MaxLength } from 'class-validator'

@InputType('DirectorateOfEqualityEqualityAttachmentsInput')
export class EqualityAttachmentsInput {
  @Field(() => String)
  applicationId!: string
}

/**
 * Asks DMR for a presigned URL to PUT one fylgiskjal to. The bytes never pass
 * through GraphQL: the browser uploads them straight to `url`, then registers
 * the returned `key` with `AddEqualityAttachmentInput`.
 */
@InputType('DirectorateOfEqualityPresignEqualityAttachmentInput')
export class PresignEqualityAttachmentInput {
  @Field(() => String)
  applicationId!: string

  /** pdf, docx, xlsx or xls. Case and a leading dot are ignored. */
  @Field(() => String)
  @MaxLength(10)
  extension!: string
}

@InputType('DirectorateOfEqualityAddEqualityAttachmentInput')
export class AddEqualityAttachmentInput {
  @Field(() => String)
  applicationId!: string

  /** The key the presign call returned. */
  @Field(() => String)
  @MaxLength(256)
  key!: string

  /** Shown to reviewers. Its extension must match the key's. */
  @Field(() => String)
  @MaxLength(255)
  filename!: string
}

@InputType('DirectorateOfEqualityDeleteEqualityAttachmentInput')
export class DeleteEqualityAttachmentInput {
  @Field(() => String)
  applicationId!: string

  @Field(() => String)
  @IsUUID()
  attachmentId!: string
}

/**
 * Asks DMR for a presigned URL to PUT the plan PDF to. PDF only, so nothing but
 * the application is needed. The returned key then goes in
 * `equalityReportPdfKey` on the content mutations.
 */
@InputType('DirectorateOfEqualityPresignEqualityPlanInput')
export class PresignEqualityPlanInput {
  @Field(() => String)
  applicationId!: string
}
