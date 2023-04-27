import dynamic from 'next/dynamic'

export const FeaturedSupportQNAs = dynamic(
  () => import('./FeaturedSupportQNAs'),
  { ssr: false },
)
