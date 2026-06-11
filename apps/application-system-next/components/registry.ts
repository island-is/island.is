import dynamic from 'next/dynamic'
import { z } from 'zod'

/**
 * Custom component registry for SDF.
 *
 * Each entry maps a component name (from CustomComponent.componentName in the
 * GraphQL payload) to:
 *   - component: a dynamically imported React component
 *   - propsSchema: a Zod schema to validate the JSON props at runtime
 *
 * Security: Custom components that write to the answers store MUST go through
 * the onAnswerChange callback, not direct local state (§8, Constraint 5).
 * The Zod schema catches prop mismatches before rendering (§8, Constraint 15).
 *
 * **Write policy:** Only names in {@link ALLOWED_CUSTOM_COMPONENT_NAMES} receive
 * `onAnswerChange`. All other names render read-only (props still validated when
 * registered). Add a name here when the template + security review approves
 * server-validated writes for that escape hatch.
 */

const FallbackComponent = dynamic(
  () => import('./custom/FallbackCustomComponent'),
)

interface RegistryEntry {
  component: ReturnType<typeof dynamic>
  propsSchema: z.ZodType
}

const registry: Record<string, RegistryEntry> = {
  // Example: ParentalTimeline would be registered here when the template
  // team creates its escape hatch component:
  //
  // ParentalTimeline: {
  //   component: dynamic(() =>
  //     import('@island.is/application/ui-fields').then(
  //       (m) => m.ParentalTimeline,
  //     ),
  //   ),
  //   propsSchema: z.object({
  //     maxDays: z.number(),
  //   }),
  // },
}

/** Escape hatches allowed to receive `onAnswerChange` (server round-trips only). */
export const ALLOWED_CUSTOM_COMPONENT_NAMES = new Set<string>([])

export const isCustomComponentWriteAllowed = (
  componentName: string,
): boolean => ALLOWED_CUSTOM_COMPONENT_NAMES.has(componentName)

export const getCustomComponent = (componentName: string): RegistryEntry => {
  return (
    registry[componentName] ?? {
      component: FallbackComponent,
      propsSchema: z.record(z.unknown()),
    }
  )
}

export const validateCustomComponentProps = (
  componentName: string,
  rawProps: string,
): { valid: boolean; parsed: Record<string, unknown> } => {
  const entry = registry[componentName]
  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(rawProps)
  } catch {
    reportPropsMismatch(componentName, 'Failed to parse props JSON')
    return { valid: false, parsed: {} }
  }

  if (!entry) {
    return { valid: true, parsed }
  }

  const result = entry.propsSchema.safeParse(parsed)
  if (!result.success) {
    const errorMsg =
      'error' in result ? (result.error as { message: string }).message : 'unknown'
    reportPropsMismatch(
      componentName,
      `Props validation failed: ${errorMsg}`,
    )
    return { valid: false, parsed }
  }

  return { valid: true, parsed: result.data as Record<string, unknown> }
}

const reportPropsMismatch = (componentName: string, message: string) => {
  const fullMessage = `[SDF] CustomComponent "${componentName}": ${message}`

  if (process.env.NODE_ENV === 'development') {
    console.warn(fullMessage)
  } else if (typeof window !== 'undefined' && 'Sentry' in window) {
    ;(window as unknown as { Sentry: { captureMessage: (m: string) => void } })
      .Sentry.captureMessage(fullMessage)
  }
}
