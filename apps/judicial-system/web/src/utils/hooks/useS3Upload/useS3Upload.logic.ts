/**
 * Defendant id used when creating the case-file row for an upload.
 *
 * Prefer the stamp on the file. If the file is stamped for a civil claimant
 * only, do not fall back to the hook's defendantId — a party change without a
 * page reset would otherwise upload that file on the defendant path.
 */
export const resolveUploadFileDefendantId = (
  file: {
    defendantId?: string | null
    civilClaimantId?: string | null
  },
  hookDefendantId?: string,
): string | undefined => {
  const defendantId =
    file.defendantId ?? (file.civilClaimantId ? undefined : hookDefendantId)

  return defendantId ?? undefined
}
