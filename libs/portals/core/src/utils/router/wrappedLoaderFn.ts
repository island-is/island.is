import { LoaderFunction } from 'react-router-dom'
import { PortalModuleRoutesProps } from '../../types/portalCore'

export type WrappedLoaderFn = (props: PortalModuleRoutesProps) => LoaderFunction
