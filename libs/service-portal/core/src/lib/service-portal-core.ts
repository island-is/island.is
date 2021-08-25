import { LazyExoticComponent, FC } from 'react'
import { User } from 'oidc-client'
import { ServicePortalPath } from './navigation/paths'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { MessageDescriptor } from 'react-intl'
import { IconProps } from '@island.is/island-ui/core'

/**
 * A navigational item used by the service portal
 */
export interface ServicePortalNavigationItem {
  name: MessageDescriptor | string
  path?: ServicePortalPath
  external?: boolean
  // System routes are always rendered in the navigation
  systemRoute?: boolean
  icon?: Pick<IconProps, 'icon' | 'type'>
  children?: ServicePortalNavigationItem[]

  // Hides the child item from the navigation bar, displays the breadcrumb.
  navHide?: boolean

  // These two fields are used for the MVP version of the service portal where
  // the routes are pretty uniform, this will most likely be removed in the future
  // Optional header to be displayed above the nav item in the sidebar
  heading?: MessageDescriptor
  // Optional divider to be displayed above the nav item in the sidebar
  divider?: boolean
  /**
   * Indicates if the user has access to the navigation item
   */
  enabled?: boolean
}

/**
 * The props provided to a service portal module
 */
export interface ServicePortalModuleProps {
  userInfo: User
  client: ApolloClient<NormalizedCacheObject>
}

/**
 * A rendered out by the render value of a service portal route
 */
export type ServicePortalModuleComponent<P = {}> = FC<
  ServicePortalModuleProps & P
>

/**
 * The render value of a service portal route
 */
export type ServicePortalModuleRenderValue<P = {}> = LazyExoticComponent<
  ServicePortalModuleComponent<P>
>

/**
 * A route defined by a service portal module
 */
export type ServicePortalRoute = {
  /**
   * The title of this route
   */
  name: MessageDescriptor | string
  /**
   * Describes the path or paths used to route to this component
   */
  path: ServicePortalPath | ServicePortalPath[]
  /**
   * Indicates if the user has access to the route
   */
  enabled?: boolean
  /**
   * The render value of this component
   */
  render?: (props: ServicePortalModuleProps) => ServicePortalModuleRenderValue
}

/**
 * A widget defined by a service portal module
 */
export type ServicePortalWidget = {
  /**
   * Describes the name of this widget, displayed on the dashboard above it fx.
   */
  name: MessageDescriptor | string
  /**
   * Weight determines how widgets are sorted on the dashboard.
   * The lower the weight, the higher up it is
   */
  weight: number
  /**
   * The render value of this widget
   */
  render: (props: ServicePortalModuleProps) => ServicePortalModuleRenderValue
}

/**
 * A global component provides functionality that
 * is applicable system wide and does not belong in one route
 */
export interface ServicePortalGlobalComponent {
  /**
   * A selection of props that should be given to the component
   */
  props?: any
  /**
   * The render value of the component
   */
  render: () => ServicePortalModuleRenderValue<any>
}

export interface ServicePortalModule {
  /**
   * The title of this module
   */
  name: MessageDescriptor | string
  /**
   * An optional render value of widgets that should
   * be displayed on the dashboard
   */
  widgets: (props: ServicePortalModuleProps) => ServicePortalWidget[]
  /**
   * The routes defined by this module.
   * The service portal shell will define these as routes
   * within itself and use the provided render function to render out the component
   */
  routes: (props: ServicePortalModuleProps) => ServicePortalRoute[]
  /**
   * Dynamic routes that might have a slow response time will be loaded after inital routes.
   */
  dynamicRoutes?: (
    props: ServicePortalModuleProps,
  ) => Promise<ServicePortalRoute[]>
  /**
   * Global components will always be rendered by default
   * These are usually utility components that prompt the user about certain
   * things or provide other global functionality
   * Example: A modal providing onboarding for unfilled user profiles
   */
  global?: (
    props: ServicePortalModuleProps,
  ) => Promise<ServicePortalGlobalComponent[]>
}
