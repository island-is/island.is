import { LazyExoticComponent, FC } from 'react'
import { IconTypes } from '@island.is/island-ui/core'
// eslint-disable-next-line
import { JwtToken } from 'apps/service-portal/src/mirage-server/models/jwt-model'

export interface ServicePortalNavigationItem {
  name: string
  path?: string
  external?: boolean
  icon?: IconTypes
  children?: ServicePortalNavigationItem[]
}

interface ServicePortalModuleProps {
  userInfo: JwtToken
}

export type ServicePortalModuleComponent = FC<ServicePortalModuleProps>

export type ServicePortalModuleRenderValue = LazyExoticComponent<
  ServicePortalModuleComponent
>

export type ServicePortalRoute = {
  /**
   * The title of this route
   */
  name: string
  /**
   * Describes the path used to route to this component
   */
  path: string
  /**
   * Routes are defined as exact by default
   * This flags it as a catch-all parent route that
   * defines it's own nested routing
   */
  catchAll?: boolean
  /**
   * The render value of this component
   */
  render: (userInfo: JwtToken) => ServicePortalModuleRenderValue
}

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
  render: (userInfo: JwtToken) => ServicePortalModuleRenderValue
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
  widgets: (userInfo: JwtToken) => ServicePortalWidget[]
  /**
   * The routes defined by this module
   */
  routes: (userInfo: JwtToken) => ServicePortalRoute[]
}
