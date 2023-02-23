import dynamic from 'next/dynamic'

export const SyslumennHeader = dynamic(() => import('./SyslumennHeader'), {
  ssr: false,
})

export const SyslumennFooter = dynamic(() => import('./SyslumennFooter'), {
  ssr: false,
})
