import { PortalModuleRoutesProps } from '@island.is/portals/core'
import { LoaderFunction } from 'react-router-dom'

export type WrappedLoaderFn = (props: PortalModuleRoutesProps) => LoaderFunction
