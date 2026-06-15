import dynamic from 'next/dynamic'

export const SyslumennFooter = dynamic(() => import('./SyslumennFooter'), {
  ssr: true,
})
