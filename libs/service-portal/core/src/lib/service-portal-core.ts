import React, { LazyExoticComponent } from 'react'

export interface ServicePortalNavigationItem {
  name: string
  url: string
  children?: ServicePortalNavigationItem[]
}

/* eslint-disable-next-line */
export interface ServicePortalModuleProps {}

export interface ServicePortalModule {
  navigation: () => Promise<ServicePortalNavigationItem>
  widgets: () => React.LazyExoticComponent<React.ComponentType<any>>
  render: () => React.LazyExoticComponent<
    (props: ServicePortalModuleProps) => JSX.Element
  >
}
