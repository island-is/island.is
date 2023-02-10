import dynamic from 'next/dynamic'

export const UtlendingastofnunHeader = dynamic(() =>
  import('./UtlendingastofnunHeader'),
)

export const UtlendingastofnunFooter = dynamic(() =>
  import('./UtlendingastofnunFooter'),
)
