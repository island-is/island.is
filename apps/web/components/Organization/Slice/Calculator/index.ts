import dynamic from 'next/dynamic'

export const Calculator = dynamic(() => import('./components/Calculator'), {
  ssr: false,
})
