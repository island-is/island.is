import { useLocale } from '@island.is/localization'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Icon,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import {
  SignatureCollection,
  SignatureCollectionCollectionType,
} from '@island.is/api/schema'
import { m } from '../../lib/messages'
import { pdf } from '@react-pdf/renderer'
import MyPdfDocument from './MyPdfDocument'
import { SignatureCollectionAreaSummaryReportDocument } from './MyPdfDocument/areaSummary.generated'
import { useLazyQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'
import { SignatureCollectionAdminCandidateReportDocument } from './MyPdfDocument/candidateSummary.generated'

export const DownloadReports = ({
  collection,
}: {
  collection: SignatureCollection
}) => {
  const { collectionType } = collection
  const { formatMessage } = useLocale()
  const [getAreaReport, { loading: loadingSummary }] = useLazyQuery(
    SignatureCollectionAreaSummaryReportDocument,
  )
  const [getCandidateReport, { loading: loadingCandidate }] = useLazyQuery(
    SignatureCollectionAdminCandidateReportDocument,
  )
  const instance = pdf(undefined)

  const { municipality, constituencyName, candidateId } = useParams<{
    municipality?: string
    constituencyName?: string
    candidateId?: string
  }>()

  // area is used for LocalGovernmental and Parliamentary collections,
  // candidate is used for Presidential collections
  const target =
    collectionType === SignatureCollectionCollectionType.LocalGovernmental
      ? collection.areas.find((a) => a.name === municipality)
      : collectionType === SignatureCollectionCollectionType.Parliamentary
      ? collection.areas.find((a) => a.name === constituencyName)
      : collection.candidates.find((c) => c.id === candidateId)

  const handleDownloadCandidateReport = async () => {
    if (!loadingCandidate) {
      getCandidateReport({
        variables: {
          input: {
            candidateId: target?.id,
            collectionType,
          },
        },
        onCompleted: (res) => {
          instance.updateContainer(
            <MyPdfDocument
              report={res.signatureCollectionAdminCandidateReport}
            />,
            async () => {
              const url = await instance
                .toBlob()
                .then((b) => URL.createObjectURL(b))
              window.open(url, '_blank')
            },
          )
        },
        fetchPolicy: 'no-cache',
      })
    }
  }

  const handleDownloadAreaReport = async () => {
    if (!loadingSummary) {
      getAreaReport({
        variables: {
          input: {
            areaId: target?.id,
            collectionId:
              collectionType ===
              SignatureCollectionCollectionType.LocalGovernmental
                ? target?.collectionId
                : collection?.id,
          },
        },
        onCompleted: (res) => {
          instance.updateContainer(
            <MyPdfDocument report={res.signatureCollectionAreaSummaryReport} />,
            async () => {
              const url = await instance
                .toBlob()
                .then((b) => URL.createObjectURL(b))
              window.open(url, '_blank')
            },
          )
        },
        fetchPolicy: 'no-cache',
      })
    }
  }

  return (
    <GridRow>
      <GridColumn span={['12/12', '12/12', '12/12', '10/12']}>
        <Box display="flex">
          <Box marginTop={1}>
            <Tag>
              <Box display="flex" justifyContent="center">
                <Icon icon="document" type="outline" color="blue600" />
              </Box>
            </Tag>
          </Box>
          <Box marginLeft={3}>
            <Text variant="h4">{formatMessage(m.downloadReport)}</Text>
            <Text marginBottom={2}>
              {formatMessage(m.downloadReportsDescription)}
            </Text>
            <Button
              variant="text"
              size="small"
              disabled={loadingSummary || loadingCandidate}
              loading={loadingSummary || loadingCandidate}
              onClick={() =>
                collectionType ===
                SignatureCollectionCollectionType.Presidential
                  ? handleDownloadCandidateReport()
                  : handleDownloadAreaReport()
              }
            >
              {formatMessage(m.downloadReport)}
            </Button>
          </Box>
        </Box>
      </GridColumn>
    </GridRow>
  )
}

export default DownloadReports
