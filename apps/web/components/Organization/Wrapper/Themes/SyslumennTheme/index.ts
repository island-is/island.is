import dynamic from 'next/dynamic'

export const SyslumennHeader = dynamic(() => import('./SyslumennHeader'))

export const SyslumennFooter = dynamic(() => import('./SyslumennFooter'))
