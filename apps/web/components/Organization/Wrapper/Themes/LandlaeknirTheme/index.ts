import dynamic from 'next/dynamic'

export const LandlaeknirFooter = dynamic(() => import('./LandlaeknirFooter'), {
  ssr: false,
})

export const LandlaeknirHeader = dynamic(() => import('./LandlaeknirHeader'), {
  ssr: false,
})
