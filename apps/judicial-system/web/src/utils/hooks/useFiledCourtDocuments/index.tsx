import { useContext, useMemo } from 'react'

import {
  isPrisonAdminUser,
  isPublicProsecutionOfficeUser,
} from '@island.is/judicial-system/types'
import {
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { CourtDocumentType } from '@island.is/judicial-system-web/src/graphql/schema'

const useFiledCourtDocuments = () => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)

  const shouldNotSeePrefix = user
    ? isPrisonAdminUser(user) || isPublicProsecutionOfficeUser(user)
    : false

  const filedCourtDocuments = useMemo(() => {
    // Documents copied in from a merged case are ordinary documents of this
    // case, filed in its sessions and numbered in its one sequence, so they
    // come along with the rest.
    const filedDocuments = (workingCase.courtSessions ?? [])
      .filter((session) => session.isConfirmed)
      .flatMap((session) => session.filedDocuments ?? [])

    const uploadedFiledDocuments = filedDocuments.filter(
      (doc) => doc.documentType === CourtDocumentType.UPLOADED_DOCUMENT,
    )

    const generatedFiledDocuments = filedDocuments.filter(
      (doc) => doc.documentType === CourtDocumentType.GENERATED_DOCUMENT,
    )

    return {
      uploadedFiledDocuments,
      generatedFiledDocuments,
    }
  }, [workingCase])

  const isFiledInConfirmedCourtSession = (caseFileId: string) =>
    Boolean(
      workingCase.courtSessions?.some(
        (session) =>
          session.isConfirmed &&
          session.filedDocuments?.some((doc) => doc.caseFileId === caseFileId),
      ),
    )

  const prefixUploadedDocumentNameWithDocumentOrder = (
    caseFileId: string,
    name: string,
  ) => {
    if (shouldNotSeePrefix) {
      return name
    }

    const { uploadedFiledDocuments } = filedCourtDocuments

    const document = uploadedFiledDocuments.find(
      (doc) => doc.caseFileId === caseFileId,
    )

    if (!document || !document.documentOrder) {
      return name
    }

    return `${document.documentOrder}. ${name}`
  }

  const prefixGeneratedDocumentNameWithDocumentOrder = (
    partialUri: string,
    name: string,
    caseId?: string,
  ) => {
    if (shouldNotSeePrefix) {
      return name
    }

    const { generatedFiledDocuments } = filedCourtDocuments

    const document = generatedFiledDocuments.find(
      (doc) =>
        doc.generatedPdfUri?.includes(caseId ?? workingCase.id) &&
        doc.generatedPdfUri?.includes(partialUri),
    )

    if (!document || !document.documentOrder) {
      return name
    }

    return `${document.documentOrder}. ${name}`
  }

  return {
    isFiledInConfirmedCourtSession,
    prefixUploadedDocumentNameWithDocumentOrder,
    prefixGeneratedDocumentNameWithDocumentOrder,
  }
}

export default useFiledCourtDocuments
