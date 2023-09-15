import { ProblemTemplateProps } from '@island.is/island-ui/core'

export type CommonProblemProps = Pick<
  ProblemTemplateProps,
  'noBorder' | 'tag' | 'imgAlt' | 'imgSrc' | 'expand' | 'titleSize'
>

export type ProblemSize = 'small' | 'large'
