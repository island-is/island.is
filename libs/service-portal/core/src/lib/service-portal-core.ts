import { LazyExoticComponent, FC } from 'react'
import { IconTypes } from '@island.is/island-ui/core'
import { User } from 'oidc-client'

export interface ServicePortalNavigationItem {
  name: string
  url: string
  icon?: IconTypes
  children?: ServicePortalNavigationItem[]
}

export interface ServicePortalNavigationRoot
  extends ServicePortalNavigationItem {
  section: 'actions' | 'info'
  order: number
}

interface ServicePortalModuleProps {
  userInfo: User
}

export type ServicePortalModuleComponent = FC<ServicePortalModuleProps>

export type ServicePortalModuleRenderValue = LazyExoticComponent<
  ServicePortalModuleComponent
>

export interface ServicePortalModule {
  /**
   * Used as the module title in the shell
   * in various components such as when rendering
   * widgets on the dashboard*/
  name: string
  /**
   * Describes the root route of this module
   * and how the shell navigates to it
   * Fx: Module: Fjármál, path: /fjarmal
   */
  path: string
  /**
   * Returns a promise of a navigation tree
   * that will render in the shell's sidebar.
   */
  navigation: (userInfo: User) => Promise<ServicePortalNavigationRoot>
  /**
   * An optional render value of widgets that should
   * be displayed on the dashboard
   */
  widgets: (userInfo: User) => ServicePortalModuleRenderValue
  /**
   * The root render value of this module.
   */
  render: (userInfo: User) => ServicePortalModuleRenderValue
}
