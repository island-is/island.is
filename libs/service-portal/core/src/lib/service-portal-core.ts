import { LazyExoticComponent } from 'react'
import { IconTypes } from '@island.is/island-ui/core'

export interface ServicePortalNavigationItem {
  name: string
  url: string
  icon?: IconTypes
  children?: ServicePortalNavigationItem[]
}

export interface ServicePortalModuleProps {
  activeSubjectNationalId: string
}

export type ServicePortalModuleRenderValue = LazyExoticComponent<
  () => JSX.Element
>

export interface ServicePortalModule {
  name: string
  navigation: (
    props: ServicePortalModuleProps,
  ) => Promise<ServicePortalNavigationItem>
  widgets: (props: ServicePortalModuleProps) => ServicePortalModuleRenderValue
  render: (props: ServicePortalModuleProps) => ServicePortalModuleRenderValue
}
