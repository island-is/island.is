import {
  PortalModule,
  PortalModuleComponent,
  PortalNavigationItem,
  PortalRoute,
} from '@island.is/portals/core'

/**
 * A navigational item used by the service portal
 */
export type ServicePortalNavigationItem = PortalNavigationItem

/**
 * A rendered out by the render value of a service portal route
 */
export type ServicePortalModuleComponent<P = {}> = PortalModuleComponent<P>

/**
 * A route defined by a service portal module
 */
export type ServicePortalRoute = PortalRoute

export type ServicePortalModule = PortalModule

const k = 8
