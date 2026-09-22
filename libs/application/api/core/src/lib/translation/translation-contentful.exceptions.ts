import { BadRequestException } from '@nestjs/common'

export class TranslationNamespaceNotExtractedException extends BadRequestException {
  constructor(namespace: string) {
    super(
      `Namespace "${namespace}" has not been extracted to Contentful yet; run "yarn nx run <project>:extract-strings"`,
    )
  }
}

/**
 * Postgres-backed publish/rollback/history no longer reflect what autosave
 * writes to Contentful, so these operations are guarded off instead of
 * silently operating on stale data.
 */
export class TranslationContentfulMigrationGuardException extends BadRequestException {
  constructor(operation: string) {
    super(
      `${operation} is not yet available for Contentful-backed namespaces`,
    )
  }
}

/**
 * Belt-and-braces write guard: the resolved Contentful entry isn't the
 * `namespace` content type, or its fields.namespace doesn't match the
 * requested namespace. Should never fire in normal operation -- if it does,
 * it's either a Contentful-side data problem or a token/scope issue.
 */
export class TranslationContentfulEntryMismatchException extends BadRequestException {
  constructor(namespace: string) {
    super(`Resolved Contentful entry does not match namespace ${namespace}`)
  }
}
