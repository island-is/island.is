import type { FC, PropsWithChildren } from 'react'
import * as InstitutionLogos from '@island.is/application/assets/institution-logos'

/** Introspection reports the component's local name; barrel re-exports can differ. */
const LOGO_KEY_ALIASES: Record<string, string> = {
  CoatOfArmsLogo: 'CoatOfArms',
}

function isLogoComponent(
  value: unknown,
): value is FC<PropsWithChildren<unknown>> {
  return typeof value === 'function'
}

const resolveLogoComponent = (
  logoKey: string | null | undefined,
): FC<PropsWithChildren<unknown>> | null => {
  if (!logoKey) return null
  const exportsByKey = InstitutionLogos as unknown as Record<string, unknown>
  const direct = exportsByKey[logoKey]
  if (isLogoComponent(direct)) return direct

  const aliasTarget = LOGO_KEY_ALIASES[logoKey]
  if (aliasTarget) {
    const aliased = exportsByKey[aliasTarget]
    if (isLogoComponent(aliased)) return aliased
  }
  return null
}

export interface TranslationWorkspaceFormLogoProps {
  logoKey: string | null | undefined
}

/** Renders the same SVG institution logos used by live application forms (`form.logo`). */
export const TranslationWorkspaceFormLogo: FC<
  TranslationWorkspaceFormLogoProps
> = ({ logoKey }) => {
  const Logo = resolveLogoComponent(logoKey)
  if (!Logo) return null
  return <Logo />
}
