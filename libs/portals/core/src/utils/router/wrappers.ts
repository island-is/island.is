import { ActionFunction, LoaderFunction } from 'react-router-dom'
import { PortalModuleRoutesProps } from '../../types/portalCore'

export type WrappedActionFn = (props: PortalModuleRoutesProps) => ActionFunction

export type WrappedLoaderFn = (props: PortalModuleRoutesProps) => LoaderFunction
