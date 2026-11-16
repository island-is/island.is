import { Case } from '../repository'

export type RequestCaseDefenderRecipient = {
  name?: string
  email: string
  nationalId?: string
}

/**
 * Unique defenders assigned on request-case defendants, keyed by email.
 * Defender contact lives on the defendant only, so each defendant can have
 * a different defender.
 */
export const getRequestCaseDefenderRecipients = (
  theCase: Pick<Case, 'defendants'>,
): RequestCaseDefenderRecipient[] => {
  const recipients: RequestCaseDefenderRecipient[] = []
  const seen = new Set<string>()

  for (const defendant of theCase.defendants ?? []) {
    const trimmedEmail = defendant.defenderEmail?.trim()

    if (!trimmedEmail) {
      continue
    }

    const emailKey = trimmedEmail.toLowerCase()

    if (seen.has(emailKey)) {
      continue
    }

    seen.add(emailKey)
    recipients.push({
      name: defendant.defenderName ?? undefined,
      email: trimmedEmail,
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
