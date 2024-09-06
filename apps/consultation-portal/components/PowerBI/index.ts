import dynamic from 'next/dynamic'

export const PowerBIComponent = dynamic(() => import('./PowerBI'), {
  ssr: false,
})
