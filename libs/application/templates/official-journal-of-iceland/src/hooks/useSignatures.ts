import { getValueViaPath } from '@island.is/application/core'
import { useApplication } from './useUpdateApplication'
import { useCallback, useEffect, useState } from 'react'
import {
  getEmptyRecord,
  getEmptySignature,
  getEmptySignatureMember,
  signatureTemplate,
} from '../components/signatures/utils'
import {
  SignatureInstitutionKey,
  SignatureMemberKey,
  SignatureSchema,
} from '../lib/dataSchema'
import { InputFields } from '../lib/types'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'

type UseSignaturesProps = {
  applicationId: string
  variant: 'regular' | 'committee'
}

export const useSignatures = ({
  applicationId,
  variant,
}: UseSignaturesProps) => {
  const signaturePath =
    variant === 'regular'
      ? InputFields.signature.regular
      : InputFields.signature.committee

  const recordsPath = `${signaturePath}.records`

  const { application, updateApplicationV2 } = useApplication({
    applicationId: applicationId,
  })

  const currentSignature = getValueViaPath(application.answers, signaturePath)

  const [signatureState, setSignatureState] = useState<SignatureSchema>(
    currentSignature
      ? currentSignature
      : getEmptySignature(variant === 'regular'),
  )

  useEffect(() => {
    return () => {
      handleUpdateChairman.cancel()
      handleUpdateMember.cancel()
      handleUpdateSignature.cancel()
      handleRemoveRecord.cancel()
      handleAddRecord.cancel()
      handleRemoveMember.cancel()
      handleAddMember.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const html = signatureTemplate(signatureState)

  const updateSignature = (
    key: SignatureInstitutionKey,
    value: string,
    recordIndex: number,
  ) => {
    const updatedRecords = signatureState.records?.map((record, index) => {
      if (index === recordIndex) {
        return {
          ...record,
          [key]: value,
        }
      }
      return record
    })

    updateApplicationV2({
      path: recordsPath,
      value: updatedRecords,
      onComplete: () => {
        setSignatureState({
          ...signatureState,
          records: updatedRecords,
        })
      },
    })
  }

  const updateChairman = (
    key: SignatureMemberKey,
    value: string,
    recordIndex: number,
  ) => {
    const updatedRecords = signatureState.records?.map((record, index) => {
      if (index === recordIndex) {
        return {
          ...record,
          chairman: {
            ...record.chairman,
            [key]: value,
          },
        }
      }
      return record
    })

    updateApplicationV2({
      path: recordsPath,
      value: updatedRecords,
      onComplete: () => {
        setSignatureState({
          ...signatureState,
          records: updatedRecords,
        })
      },
    })
  }

  const updateMember = (
    key: SignatureMemberKey,
    value: string,
    recordIndex: number,
    memberIndex: number,
  ) => {
    const updatedRecords = signatureState.records?.map((record, index) => {
      if (index === recordIndex) {
        return {
          ...record,
          members: record.members?.map((member, mi) => {
            if (memberIndex === mi) {
              return {
                ...member,
                [key]: value,
              }
            }
            return member
          }),
        }
      }
      return record
    })

    updateApplicationV2({
      path: recordsPath,
      value: updatedRecords,
      onComplete: () => {
        setSignatureState({
          ...signatureState,
          records: updatedRecords,
        })
      },
    })
  }

  const addMember = (recordIndex: number) => {
    const newMember = getEmptySignatureMember()

    const updatedRecords = signatureState.records?.map((record, index) => {
      if (index === recordIndex) {
        return {
          ...record,
          members: [...(record.members || []), newMember],
        }
      }
      return record
    })

    updateApplicationV2({
      path: recordsPath,
      value: updatedRecords,
      onComplete: () => {
        setSignatureState({
          ...signatureState,
          records: updatedRecords,
        })
      },
    })
  }

  const removeMember = (recordIndex: number, memberIndex: number) => {
    const updatedRecords = signatureState.records?.map((record, index) => {
      if (index === recordIndex) {
        return {
          ...record,
          members: record.members?.filter((_, i) => i !== memberIndex),
        }
      }
      return record
    })

    updateApplicationV2({
      path: recordsPath,
      value: updatedRecords,
      onComplete: () => {
        setSignatureState({
          ...signatureState,
          records: updatedRecords,
        })
      },
    })
  }

  const addRecord = () => {
    const updatedRecords = [...(signatureState.records || []), getEmptyRecord()]

    updateApplicationV2({
      path: recordsPath,
      value: updatedRecords,
      onComplete: () => {
        setSignatureState({
          ...signatureState,
          records: updatedRecords,
        })
      },
    })
  }

  const removeRecord = (recordIndex: number) => {
    const updatedRecords = signatureState.records?.filter(
      (_, i) => i !== recordIndex,
    )

    updateApplicationV2({
      path: recordsPath,
      value: updatedRecords,
      onComplete: () => {
        setSignatureState({
          ...signatureState,
          records: updatedRecords,
        })
      },
    })
  }

  const handleUpdateSignature = useCallback(debounce(updateSignature, 500), [
    updateSignature,
  ])
  const handleUpdateMember = useCallback(debounce(updateMember, 500), [
    updateMember,
  ])
  const handleUpdateChairman = useCallback(debounce(updateChairman, 500), [
    updateChairman,
  ])
  const handleRemoveRecord = throttle(removeRecord, 500)
  const handleAddRecord = throttle(addRecord, 500)
  const handleRemoveMember = throttle(removeMember, 500)
  const handleAddMember = throttle(addMember, 500)

  return {
    signature: signatureState,
    signatureHtml: html,
    handleAddRecord,
    handleRemoveRecord,
    handleUpdateSignature,
    handleUpdateChairman,
    handleUpdateMember,
    handleRemoveMember,
    handleAddMember,
  }
}
