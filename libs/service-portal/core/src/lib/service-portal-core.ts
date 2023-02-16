import {
  PortalModule,
  PortalModuleComponent,
  PortalModuleProps,
  PortalModuleRenderValue,
  PortalNavigationItem,
  PortalRoute,
} from '@island.is/portals/core'

/**
 * A navigational item used by the service portal
 */
export type ServicePortalNavigationItem = PortalNavigationItem

/**
 * The props provided to a service portal module
 */
export type ServicePortalModuleProps = PortalModuleProps

/**
 * A rendered out by the render value of a service portal route
 */
export type ServicePortalModuleComponent<P = {}> = PortalModuleComponent<P>

/**
 * The render value of a service portal route
 */
export type ServicePortalModuleRenderValue<P = {}> = PortalModuleRenderValue<P>

/**
 * A route defined by a service portal module
 */
export type ServicePortalRoute = PortalRoute

export type ServicePortalModule = PortalModule
