import { defineModules } from '@island.is/portals/core'
import { modules } from '../lib/modules'

const { useModules, ModulesProvider } = defineModules({ modules })

export { useModules, ModulesProvider }
