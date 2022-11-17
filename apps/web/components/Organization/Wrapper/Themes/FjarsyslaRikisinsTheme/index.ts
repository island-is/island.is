import dynamic from 'next/dynamic'

export const FjarsyslaRikisinsFooter = dynamic(() =>
  import('./FjarsyslaRikisinsFooter'),
)

export const FjarsyslaRikisinsHeader = dynamic(() =>
  import('./FjarsyslaRikisinsHeader'),
)
