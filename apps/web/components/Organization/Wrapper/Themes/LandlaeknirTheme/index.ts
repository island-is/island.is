import dynamic from 'next/dynamic'

export const LandlaeknirFooter = dynamic(() => import('./LandlaeknirFooter'), {
  ssr: false,
})
