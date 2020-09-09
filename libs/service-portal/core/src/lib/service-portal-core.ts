import { LazyExoticComponent, FC } from 'react'
import { IconTypes } from '@island.is/island-ui/core'
import { User } from 'oidc-client'
import { ServicePortalPath } from './navigation/paths'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

/**
 * A navigational item used by the service portal
 */
export interface ServicePortalNavigationItem {
  name: string
  path?: ServicePortalPath
  external?: boolean
  icon?: IconTypes
  children?: ServicePortalNavigationItem[]
}

/**
 * The props provided to a service portal module
 */
export interface ServicePortalModuleProps {
  userInfo: UserWithMeta
  client: ApolloClient<NormalizedCacheObject>
}

/**
 * A rendered out by the render value of a service portal route
 */
export type ServicePortalModuleComponent = FC<ServicePortalModuleProps>

/**
 * The render value of a service portal route
 */
export type ServicePortalModuleRenderValue = LazyExoticComponent<
  ServicePortalModuleComponent
>

/**
 * A route defined by a service portal module
 */
export type ServicePortalRoute = {
  /**
   * The title of this route
   */
  name: string
  /**
   * Describes the path or paths used to route to this component
   */
  path: ServicePortalPath | ServicePortalPath[]
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
  name: string
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

export interface ServicePortalModule {
  /**
   * The title of this module
   */
  name: string
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
}

/**
 * The subject passed to us via the jwt token metadata.
 */
export interface MockSubject {
  id: number
  name: string
  nationalId: string
  scope: string[]
  subjectType: 'person' | 'company' | 'institution'
}

/**
 * Currently we are not getting any metadata from the jwt token.
 * In order to fix that issue we padded the data with some mock
 * subjects.
 */
export interface UserWithMeta {
  user: User
  mockSubjects: MockSubject[]
}

export type LanguageCode = 'is' | 'en'
