import dynamic from 'next/dynamic'

export const EnhancedAssetList = dynamic(() => import('./EnhancedAssetList'), {
  ssr: true,
})
