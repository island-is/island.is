import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { FormatMessage } from '@island.is/localization'
import { FC } from 'react'
import { MessageDescriptor } from 'react-intl'
import { RouteObject } from 'react-router-dom'

import type {
  FeatureFlagClient,
  Features,
} from '@island.is/react/feature-flags'
import { IconProps } from '@island.is/island-ui/core'
import { BffUser } from '@island.is/shared/types'
import { OrganizationSlugType } from '@island.is/shared/constants'

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
   * Hides the item from being searched.
   */
  searchHide?: boolean

  /**
   * Hides the child item from breadcrumbs.
   */
  breadcrumbHide?: boolean

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

  /**
   * Intro for module, for search purposes
   */
  intro?: MessageDescriptor

  /**
   * Search tags for module
   */
  searchTags?: MessageDescriptor[]

  /**
   * Active state for navigation item
   */
  active?: boolean

  /**
   * Active state if current path is exact match
   */
  activeIfExact?: boolean

  /**
   * Service provider id used for displaying service provider information in the module.
   */
  serviceProvider?: OrganizationSlugType

  /**
   * If the service provider logo should be displayed beneath the tab navigation
   */
  displayServiceProviderLogo?: boolean

  /**
   * Service provider tooltip to display if service provider logo is supplied.
   */
  serviceProviderTooltip?: MessageDescriptor
}

/**
 * The props provided to a  portal module
 */
export interface PortalModuleProps {
  userInfo: BffUser
}

export interface PortalModuleRoutesProps extends PortalModuleProps {
  client: ApolloClient<NormalizedCacheObject>
  featureFlagClient: FeatureFlagClient
  formatMessage: FormatMessage
}

/**
 * A rendered out by the render value of a  portal route
 */
export type PortalModuleComponent<Props = Record<string, unknown>> = FC<
  React.PropsWithChildren<PortalModuleProps & Props>
>

/**
 * A route defined by a portal module. Note that we are extending the React router RouteObject
 */
export type PortalRoute = Omit<RouteObject, 'children'> & {
  /**
   * The title of this route
   */
  name: MessageDescriptor | string
  /**
   * Describes the path used to route to this component
   */
  path: string
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
   * Child routes of this route
   */
  children?: PortalRoute[]
}

export type PortalType = 'admin' | 'my-pages'

export interface PortalModule {
  /**
   * The title of this module
   */
  name: MessageDescriptor | string

  /**
   * The routes defined by this module.
   * The  portal shell will define these as routes
   * within itself and use the provided render function to render out the component
   */
  routes: (
    props: PortalModuleRoutesProps,
  ) => Promise<PortalRoute[]> | PortalRoute[]

  /**
   * Works the same way as routes.
   * The key difference is that if there are company routes present when
   * the logged-in user is a company SSN only the company routes will be rendered.
   */
  companyRoutes?: (
    props: PortalModuleRoutesProps,
  ) => Promise<PortalRoute[]> | PortalRoute[]

  /**
   * If this is set, the module is only enabled if the feature flag is true for the authenticated user.
   * If you want to feature flag a module for companies you can configure the feature flag to be `false`
   * when the attribute "subjectType" is "legalEntity" and `true` otherwise.
   */
  featureFlag?: Features

  /**
   * Indicates if module is enabled or not
   */
  enabled?: (props: { userInfo: BffUser; isCompany: boolean }) => boolean

  /**
   * The layout type of the module
   */
  layout?:
    | 'none' // Full screen
    | 'full' // Full grid, i.e 12 cols
    | 'default' // Narrow grid, i.e. 8 cols
}
