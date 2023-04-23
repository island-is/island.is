import dynamic from 'next/dynamic'

export const LandlaeknirFooter = dynamic(() => import('./LandlaeknirFooter'), {
  ssr: true,
})

export const LandlaeknirHeader = dynamic(() => import('./LandlaeknirHeader'), {
  ssr: true,
})
