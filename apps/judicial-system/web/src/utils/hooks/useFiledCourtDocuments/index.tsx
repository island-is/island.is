import { useContext, useMemo } from 'react'

import {
  isPrisonAdminUser,
  isPublicProsecutionOfficeUser,
} from '@island.is/judicial-system/types'
import {
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CourtDocumentType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

const useFiledCourtDocuments = () => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)

  const shouldNotSeePrefix =
    isPrisonAdminUser(user) || isPublicProsecutionOfficeUser(user)

  const filedCourtDocuments = useMemo(() => {
    const filedDocuments =
      workingCase.courtSessions
        ?.filter((session) => session.isConfirmed)
        .map((session) => session.filedDocuments ?? [])
        .flat() ?? []

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
  ) => {
    if (shouldNotSeePrefix) {
      return name
    }

    const { generatedFiledDocuments } = filedCourtDocuments

    const document = generatedFiledDocuments.find((doc) =>
      doc.generatedPdfUri?.includes(partialUri),
    )

    if (!document || !document.documentOrder) {
      return name
    }

    return `${document.documentOrder}. ${name}`
  }

  return {
    prefixUploadedDocumentNameWithDocumentOrder,
    prefixGeneratedDocumentNameWithDocumentOrder,
  }
}

export default useFiledCourtDocuments
