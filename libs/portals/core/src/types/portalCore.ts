import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { FC, LazyExoticComponent } from 'react'
import { MessageDescriptor } from 'react-intl'

import type { Features } from '@island.is/react/feature-flags'
import { IconProps } from '@island.is/island-ui/core'
import { User } from '@island.is/shared/types'

/**
 * A navigational item used by the service portal
 */
export interface PortalNavigationItem {
  name: MessageDescriptor | string
  path?: string
  external?: boolean
  // System routes are always rendered in the navigation
  systemRoute?: boolean
  icon?: Pick<IconProps, 'icon' | 'type'>
  children?: PortalNavigationItem[]

  /**
   * Hides the child item from the navigation bar, displays the breadcrumb.
   */
  navHide?: boolean

  /**
   * Hides the child item from breadcrumbs.
   */
  breadcrumbHide?: boolean

  // These two fields are used for the MVP version of the  portal where
  // the routes are pretty uniform, this will most likely be removed in the future
  // Optional header to be displayed above the nav item in the sidebar
  heading?: MessageDescriptor
  // Optional divider to be displayed above the nav item in the sidebar
  divider?: boolean
  /**
   * Indicates if the user has access to the navigation item
   */
  enabled?: boolean
  /**
   * Subscribes to - get updates from badge context
   */
  subscribesTo?: 'documents'
  /**
   * Description for module
   */
  description?: MessageDescriptor
}

/**
 * The props provided to a  portal module
 */
export interface PortalModuleProps {
  userInfo: User
  client: ApolloClient<NormalizedCacheObject>
}

/**
 * A rendered out by the render value of a  portal route
 */
export type PortalModuleComponent<Props = Record<string, unknown>> = FC<
  PortalModuleProps & Props
>

/**
 * The render value of a  portal route
 */
export type PortalModuleRenderValue<
  Props = Record<string, unknown>
> = LazyExoticComponent<PortalModuleComponent<Props>>

/**
 * A route defined by a portal module
 */
export interface PortalRoute {
  /**
   * The title of this route
   */
  name: MessageDescriptor | string
  /**
   * Describes the path or paths used to route to this component
   */
  path: string | string[]
  /**
   * Indicates if the user has access to the route
   */
  enabled?: boolean
  /**
   * Hides navigation item from navigation
   */
  navHide?: boolean
  /**
   * Dynamic routes that might have a slow response time will be loaded after inital routes.
   */
  dynamic?: boolean

  /**
   * The key for the route. Used to filter feature flagged pages.
   *
   * To feature flag a route:
   * create a feature flag in ConfigCat called `isPortalVehicleHistoryPageEnabled`
   * In which case your route key would be `VehicleHistory`.
   */
  key?: string

  /**
   * The render value of this component
   */
  render?: (props: PortalModuleProps) => PortalModuleRenderValue
}

/**
 * A widget defined by a  portal module
 */
export type PortalWidget = {
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
  render: (props: PortalModuleProps) => PortalModuleRenderValue
}

/**
 * A global component provides functionality that
 * is applicable system wide and does not belong in one route
 */
export interface PortalGlobalComponent {
  /**
   * A selection of props that should be given to the component
   */
  props?: Record<string, unknown>
  /**
   * The render value of the component
   */
  render: () => PortalModuleRenderValue<any>
}

export type LayoutSizes = 'fullwidth' | 'large' | 'default'

export interface PortalModule {
  /**
   * The title of this module
   */
  name: MessageDescriptor | string
  /**
   * An optional render value of widgets that should
   * be displayed on the dashboard
   */
  widgets: (props: PortalModuleProps) => PortalWidget[]
  /**
   * The routes defined by this module.
   * The  portal shell will define these as routes
   * within itself and use the provided render function to render out the component
   */
  routes: (props: PortalModuleProps) => PortalRoute[]
  /**
   * Works the same way as routes.
   * The key difference is that if there are company routes present when
   * the logged in user is a company SSN only the company routes will be rendered.
   */
  companyRoutes?: (props: PortalModuleProps) => PortalRoute[]
  /**
   * Global components will always be rendered by default
   * These are usually utility components that prompt the user about certain
   * things or provide other global functionality
   * Example: A modal providing onboarding for unfilled user profiles
   */
  global?: (props: PortalModuleProps) => Promise<PortalGlobalComponent[]>
  /**
   * If this is set, the module is only enabled if the feature flag is true for the authenticated user.
   * If you want to feature flag a module for companies you can configure the feature flag to be `false`
   * when the attribute "subjectType" is "legalEntity" and `true` otherwise.
   */
  featureFlag?: Features

  /**
   * Indicates if module is enabled or not
   */
  enabled?: (props: { userInfo: User; isCompany: boolean }) => boolean

  /**
   * The layout size type of the module
   */
  layoutSize?: LayoutSizes

  /**
   * Module layout wrapper component for the module
   */
  moduleLayoutWrapper?: React.FC<PortalModuleProps>
}
