import { FieldBaseProps } from '@island.is/application/types'
import { z } from 'zod'
import { legalGazetteDataSchema } from './dataSchema'

export type Override<T1, T2> = Omit<T1, keyof T2> & T2

export type LGAnswers = z.infer<typeof legalGazetteDataSchema>

export type LGFieldBaseProps = Override<
  FieldBaseProps,
  {
    application: {
      answers: LGAnswers
    }
  }
>
