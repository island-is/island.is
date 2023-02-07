import dynamic from 'next/dynamic'

export const SjukratryggingarHeader = dynamic(() =>
  import('./SjukratryggingarHeader'),
)

export const SjukratryggingarFooter = dynamic(() =>
  import('./SjukratryggingarFooter'),
)
