import { defineModules, PortalModule } from '@island.is/portals/core'
import { delegationsModule } from '@island.is/portals-modules-access-control-delegations'

/**
 * NOTE:
 * Modules should only be here if they are production ready
 * or if they are ready for beta testing. Modules that are ready
 * for beta testing should be feature flagged.
 */
export type ModuleKeys = 'delegations'

export const modules: Record<ModuleKeys, PortalModule> = {
  delegations: delegationsModule,
}

const { useModules, ModulesProvider } = defineModules({ modules })

export { useModules, ModulesProvider }
