import dynamic from 'next/dynamic'

export const SyslumennHeader = dynamic(() => import('./SyslumennHeader'), {
  ssr: true,
})

export const SyslumennFooter = dynamic(() => import('./SyslumennFooter'), {
  ssr: true,
})
