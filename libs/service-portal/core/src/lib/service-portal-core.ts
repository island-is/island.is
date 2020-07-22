import { LazyExoticComponent } from 'react'
import { IconTypes } from '@island.is/island-ui/core'
// eslint-disable-next-line
import { JwtToken } from 'apps/service-portal/src/mirage-server/models/jwt-model'

export interface ServicePortalNavigationItem {
  name: string
  url: string
  icon?: IconTypes
  children?: ServicePortalNavigationItem[]
}

export type ServicePortalModuleRenderValue = LazyExoticComponent<
  () => JSX.Element
>

export interface ServicePortalModule {
  name: string
  navigation: (userInfo: JwtToken) => Promise<ServicePortalNavigationItem>
  widgets: (userInfo: JwtToken) => ServicePortalModuleRenderValue
  render: (userInfo: JwtToken) => ServicePortalModuleRenderValue
}
