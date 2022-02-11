import { RskProcuringClient } from '@island.is/clients/rsk/procuring'

export const RskProcuringClientMock: Partial<RskProcuringClient> = {
  getSimple() {
    return Promise.resolve(null)
  },
}
