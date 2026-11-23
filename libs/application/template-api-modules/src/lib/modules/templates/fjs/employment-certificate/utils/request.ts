import { getValueViaPath } from '@island.is/application/core'
import type { ApplicationWithAttachments } from '@island.is/application/types'
import { YES } from '@island.is/application/templates/fjs/employment-certificate'

export interface CertificateRequest {
  previewVersion: string
  institutionIds: string[]
  includeUnion: boolean
  comment?: string
}

/**
 * The body of `POST /employment-history/requests` from the answers, or
 * undefined when the applicant hasn't seen the history or ticked nothing.
 */
export const getCertificateRequest = (
  answers: ApplicationWithAttachments['answers'],
): CertificateRequest | undefined => {
  const previewVersion = getValueViaPath<string>(answers, 'previewVersion')
  const institutionIds =
    getValueViaPath<string[]>(answers, 'institutionIds') ?? []
  if (!previewVersion || institutionIds.length === 0) {
    return undefined
  }

  const comment = getValueViaPath<string>(answers, 'comment')?.trim()

  return {
    previewVersion,
    institutionIds,
    includeUnion: (
      getValueViaPath<string[]>(answers, 'includeUnion') ?? []
    ).includes(YES),
    ...(comment ? { comment } : {}),
  }
}
