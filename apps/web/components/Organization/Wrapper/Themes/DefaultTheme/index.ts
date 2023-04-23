import dynamic from 'next/dynamic'

export const DefaultHeader = dynamic(() => import('./DefaultHeader'), {
  ssr: true,
})
