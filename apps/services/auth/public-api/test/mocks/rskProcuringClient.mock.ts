import { RskProcuringClient } from '@island.is/clients/rsk/procuring'

export const RskProcuringClientMock: Partial<RskProcuringClient> = {
  getIndividualRelationships() {
    return Promise.resolve(null)
  },
}
