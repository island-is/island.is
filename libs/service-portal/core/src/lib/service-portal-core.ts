import { LazyExoticComponent, FC } from 'react'
import { IconTypes } from '@island.is/island-ui/core'
// eslint-disable-next-line
import { JwtToken } from 'apps/service-portal/src/mirage-server/models/jwt-model'

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
   * Returns a promise of a navigation tree
   * that will render in the shell's sidebar.
   */
  navigation: (userInfo: JwtToken) => ServicePortalNavigationRoot
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

// const navItem = {
//   name: 'Heilsu fjarmal',
//   module: 'finance',
//   weight: 0,
//   path: '/heilsa/fjarmal',
//   render: () => {},
// }

// const asf = '/fjarmal/sjukratryggingar'

// const masternav = [
//   {
//     id: 'dasf',
//     name: 'Fjármál',
//     path: '/fjarmal',
//     children: [
//       {
//         id: 'asfff',
//         name: 'Heilsu fjarmál',
//         path: '/heilsa/fjarmal',
//         children: [],
//       },
//       {
//         id: 'asf',
//         name: 'Arsreikningar',
//         path: '/fjarmal/arsreikningar',
//         children: [],
//       },
//     ],
//   },
// ]

// We would only render /heilsa/fjarmal if the heilsa module has defined
// a route for it
// paths are optional and define whether the item is a link or a parent
// define paths as an enum defining which paths exist in the application
// both the master nav and module defined routes would then use this enum
// to define paths
