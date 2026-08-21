import dynamic from 'next/dynamic'

export const RSKCalculator = dynamic(() => import('./Calculator'), {
  ssr: false,
})
