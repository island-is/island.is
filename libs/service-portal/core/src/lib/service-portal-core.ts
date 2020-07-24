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

export interface ServicePortalModule {
  name: string
  path: string
  navigation: (userInfo: JwtToken) => Promise<ServicePortalNavigationRoot>
  widgets: (userInfo: JwtToken) => ServicePortalModuleRenderValue
  render: (userInfo: JwtToken) => ServicePortalModuleRenderValue
}
