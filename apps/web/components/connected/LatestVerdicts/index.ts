import dynamic from 'next/dynamic'

export const LatestVerdicts = dynamic(() => import('./LatestVerdicts'), {
  ssr: true,
})
