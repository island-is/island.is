import dynamic from 'next/dynamic'

export const FeaturedEvents = dynamic(() => import('./FeaturedEvents'), {
  ssr: true,
})
