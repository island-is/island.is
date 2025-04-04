import {
  DataProviderResult,
  FieldBaseProps,
} from '@island.is/application/types'
import { z } from 'zod'
import { legalGazetteDataSchema } from './dataSchema'

export type Override<T1, T2> = Omit<T1, keyof T2> & T2

type OptionType = {
  label: string
  value: string
}

export type LGDataProviderResult = Override<
  DataProviderResult,
  {
    data: OptionType[]
  }
>

export type LGExternalData = {
  legalEntityOptions: LGDataProviderResult
  advertTypeOptions: LGDataProviderResult
  recentAdvertTypes: LGDataProviderResult
}

export type LGAnswers = z.infer<typeof legalGazetteDataSchema>

export type LGFieldBaseProps = Override<
  FieldBaseProps,
  {
    application: {
      answers: LGAnswers
      externalData: LGExternalData
    }
  }
>
