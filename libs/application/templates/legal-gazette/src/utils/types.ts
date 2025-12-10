import { Application, FieldBaseProps } from '@island.is/application/types'
import { z } from 'zod'
import { legalGazetteDataSchema } from '../lib/dataSchema'

export type Override<T1, T2> = Omit<T1, keyof T2> & T2

export type LGAnswers = z.infer<typeof legalGazetteDataSchema>

export type LGBaseEntity = {
  id: string
  title: string
  slug: string
}

export type LGFieldBaseProps = Override<
  FieldBaseProps,
  {
    application: Override<Application, { answers: LGAnswers }>
  }
>
