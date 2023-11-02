import { RskRelationshipsClient } from '@island.is/clients-rsk-relationships'

export const RskProcuringClientMock: Partial<RskRelationshipsClient> = {
  getIndividualRelationships() {
    return Promise.resolve(null)
  },
}
