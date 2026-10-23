import { ServiceBuilder } from '../dsl'
import { logger } from '../../common'

/**
 * This is where we do hacks, in order to do our best to support weird situations like circular dependencies, etc.
 *
 * The island.is `application-system-api` <-> `api` gateway hack lived here but
 * both services were removed in the judicial-system prune, so there is nothing
 * left to patch. Kept as a no-op so the rendering pipeline importers are stable.
 * @param fullSetOfServices
 * @param habitat
 */
export function hacks(
  fullSetOfServices: ServiceBuilder<any>[],
  habitat: ServiceBuilder<any>[],
) {
  logger.debug('hacks', { numberOfServices: fullSetOfServices.length })
}
