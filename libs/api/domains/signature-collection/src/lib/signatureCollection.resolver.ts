import { Query, Resolver } from '@nestjs/graphql'
import { Test } from './models/test.model'

@Resolver()
export class SignatureCollectionResolver {
  @Query(() => Test)
  signatureCollectionGetTest(): Promise<Test> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 300)
    })
  }

  //   signatureCollectionCanCreate

  //   signatureCollectionCurrent

  //   signatureCollectionAllLists
  
  //   signatureCollectionAllOpenLists

  //   signatureCollectionListsByOwner

  //   signatureCollectionListsByArea

  //   signatureCollectionList

  //   signatureCollectionSignedList

  //   signatureCollectionSignatures

  //   signatureCollectionFindSignature

  //   signatureCollectionCompareLists

  //   signatureCollectionCanSign

  //   signatureCollectionSignee

  //   signatureCollectionCreate

  //   signatureCollectionSign

  //   signatureCollectionUnsign

  //   signatureCollectionCancel

  //   signatureCollectionDelegateList

  //   signatureCollectionUndelegateList

  //   signatureCollectionExtendDeadline

  //   signatureCollectionBulkUploadSignatures

  //   signatureCollectionIsOwner
}
