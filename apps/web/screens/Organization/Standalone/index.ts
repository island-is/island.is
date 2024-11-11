import dynamic from 'next/dynamic'
export const Standalone = dynamic(() => import('./StandaloneLayout'), {
  ssr: false,
})
