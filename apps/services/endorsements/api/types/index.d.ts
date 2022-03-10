import { Request } from 'express'
import type { EndorsementList } from '../src/app/modules/endorsementList/endorsementList.model'

export {}
declare global {
  namespace jest {
    interface Expect {
      anyOf(input: any[])
    }
  }
}

export interface EndorsementRequest extends Request {
  auth: {
    nationalId: string
  }
  cachedEndorsementList: EndorsementList
}
