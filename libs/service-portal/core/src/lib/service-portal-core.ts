import { LazyExoticComponent, ComponentType } from 'react'

export interface ServicePortalNavigationItem {
  name: string
  url: string
  children?: ServicePortalNavigationItem[]
}

/* eslint-disable-next-line */
export interface ServicePortalModuleProps {}

export type ServicePortalModuleWidgets = LazyExoticComponent<ComponentType<any>>

export type ServicePortalModuleRenderValue = LazyExoticComponent<
  (props: ServicePortalModuleProps) => JSX.Element
>

export interface ServicePortalModule {
  navigation: () => Promise<ServicePortalNavigationItem>
  widgets: () => ServicePortalModuleWidgets
  render: () => ServicePortalModuleRenderValue
}
