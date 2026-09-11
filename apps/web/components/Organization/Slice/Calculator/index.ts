import dynamic from 'next/dynamic'

export const Calculator = dynamic(() => import('./Calculator'), {
  ssr: false,
})
