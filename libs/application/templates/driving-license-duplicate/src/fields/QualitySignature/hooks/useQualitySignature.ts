import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { QUALITY_SIGNATURE } from './queries.graphql'
import { useQuery, ApolloError } from '@apollo/client'

export interface QualitySignatureType {
  qualitySignature: string | null
  loading: boolean
  error: ApolloError | undefined
}

export type HasQualitySignatureData = {
  data: {
    hasQualitySignature: boolean
  }
}

export const useQualitySignature = (
  application: Application,
): QualitySignatureType => {
  const hasQualitySignature = getValueViaPath<HasQualitySignatureData>(
    application.externalData,
    'qualitySignature',
  )
  const { data, loading, error } = useQuery(QUALITY_SIGNATURE, {
    skip: !hasQualitySignature?.data?.hasQualitySignature,
  })

  const qualitySignature: QualitySignatureType = {
    qualitySignature: data?.drivingLicenseQualitySignature?.dataUri,
    loading: loading,
    error: error,
  }
  return qualitySignature
}
