import dynamic from 'next/dynamic'

export const TryggingastofnunHeader = dynamic(() =>
  import('./TryggingastofnunHeader'),
)
