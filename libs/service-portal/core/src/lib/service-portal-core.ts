import {
  PortalGlobalComponent,
  PortalModule,
  PortalModuleComponent,
  PortalModuleProps,
  PortalModuleRenderValue,
  PortalNavigationItem,
  PortalRoute,
  PortalWidget,
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
 * A widget defined by a service portal module
 */
export type ServicePortalWidget = PortalWidget

/**
 * A global component provides functionality that
 * is applicable system wide and does not belong in one route
 */
export type ServicePortalGlobalComponent = PortalGlobalComponent

/**
 * A route defined by a service portal module
 */
export type ServicePortalRoute = PortalRoute

export type ServicePortalModule = PortalModule
