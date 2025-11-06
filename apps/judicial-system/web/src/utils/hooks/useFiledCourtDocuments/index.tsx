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
    const filedDocuments = (workingCase.courtSessions ?? [])
      .filter((session) => session.isConfirmed)
      .flatMap((session) => {
        const filedDocuments = session.filedDocuments ?? []
        const mergedFiledDocuments = session.mergedFiledDocuments ?? []
        return [...filedDocuments, ...mergedFiledDocuments]
      })

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

    const isMergedCaseDocument = workingCase?.mergedCases?.some(
      (mergedCase) => mergedCase.id === document?.caseId,
    )

    if (!document || !document.documentOrder) {
      return name
    }

    return `${
      isMergedCaseDocument
        ? document.mergedDocumentOrder
        : document.documentOrder
    }. ${name}`
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

    const isMergedCaseDocument =
      workingCase?.mergedCases?.some(
        (mergedCase) => mergedCase.id === document?.caseId,
      ) && document?.mergedDocumentOrder

    if (!document || !document.documentOrder) {
      return name
    }

    return `${
      isMergedCaseDocument
        ? document.mergedDocumentOrder
        : document.documentOrder
    }. ${name}`
  }

  return {
    prefixUploadedDocumentNameWithDocumentOrder,
    prefixGeneratedDocumentNameWithDocumentOrder,
  }
}

export default useFiledCourtDocuments
