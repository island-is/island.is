import { Case } from '../repository'

export type RequestCaseDefenderRecipient = {
  name?: string
  email: string
  nationalId?: string
}

/**
 * Unique defenders assigned on request-case defendants, keyed by email.
 * Dual-write keeps every defendant in sync with the (still single) case-level
 * defender today, so this returns one recipient until Phase 4 allows
 * per-defendant divergence.
 */
export const getRequestCaseDefenderRecipients = (
  theCase: Pick<Case, 'defendants'>,
): RequestCaseDefenderRecipient[] => {
  const recipients: RequestCaseDefenderRecipient[] = []
  const seen = new Set<string>()

  for (const defendant of theCase.defendants ?? []) {
    if (!defendant.defenderEmail || seen.has(defendant.defenderEmail)) {
      continue
    }

    seen.add(defendant.defenderEmail)
    recipients.push({
      name: defendant.defenderName ?? undefined,
      email: defendant.defenderEmail,
      nationalId: defendant.defenderNationalId ?? undefined,
    })
  }

  return recipients
}

/** Comma-separated unique defender names for emails to other parties. */
export const formatRequestCaseDefenderNames = (
  theCase: Pick<Case, 'defendants'>,
): string | undefined => {
  const names = getRequestCaseDefenderRecipients(theCase)
    .map((recipient) => recipient.name)
    .filter((name): name is string => Boolean(name))

  return names.length > 0 ? names.join(', ') : undefined
}
