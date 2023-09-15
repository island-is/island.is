import dynamic from 'next/dynamic'
export const PowerBiSlice = dynamic(() => import('./PowerBiSlice'), {
  ssr: false,
})
