import { ProblemTemplateProps } from '@island.is/island-ui/core'
import { ReactNode } from 'react'

export type CommonProblemProps = Pick<
  ProblemTemplateProps,
  'noBorder' | 'tag' | 'imgAlt' | 'imgSrc' | 'expand' | 'titleSize'
>

export type ProblemSize = 'small' | 'large'

export type Message = ReactNode | string
