import { LazyExoticComponent, ComponentType } from 'react'
import { IconTypes } from '@island.is/island-ui/core'

export interface ServicePortalNavigationItem {
  name: string
  url: string
  icon?: IconTypes
  children?: ServicePortalNavigationItem[]
}

/* eslint-disable-next-line */
export interface ServicePortalModuleProps {}

export type ServicePortalModuleWidgets = LazyExoticComponent<ComponentType<any>>

export type ServicePortalModuleRenderValue = LazyExoticComponent<
  (props: ServicePortalModuleProps) => JSX.Element
>

export interface ServicePortalModule {
  name: string
  navigation: () => Promise<ServicePortalNavigationItem>
  widgets: () => ServicePortalModuleWidgets
  render: () => ServicePortalModuleRenderValue
}
