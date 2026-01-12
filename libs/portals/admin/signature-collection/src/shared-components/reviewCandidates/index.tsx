import {
  Box,
  Button,
  Table as T,
  toast,
  Text,
  GridRow,
  GridColumn,
  Tag,
  Icon,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useEffect, useState } from 'react'
import { Modal } from '@island.is/react/components'
import { useSignatureCollectionAdminRemoveCandidateMutation } from './removeCandidate.generated'
import {
  SignatureCollectionCandidate,
  SignatureCollectionCollectionType,
} from '@island.is/api/schema'
import { formatNationalId } from '@island.is/portals/core'
import { m } from '../../lib/messages'
import { useRevalidator } from 'react-router-dom'

const { Table, Row, Head, HeadData, Body, Data } = T

const ReviewCandidates = ({
  candidates,
  collectionType,
}: {
  candidates: Array<SignatureCollectionCandidate>
  collectionType: SignatureCollectionCollectionType
}) => {
  const { formatMessage } = useLocale()
  const { revalidate } = useRevalidator()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false)
  const [candidateInReview, setCandidateInReview] =
    useState<SignatureCollectionCandidate>()
  const [signatureCollectionAdminRemoveCandidateMutation, { loading }] =
    useSignatureCollectionAdminRemoveCandidateMutation()
  const [allCandidates, setAllCandidates] =
    useState<Array<SignatureCollectionCandidate>>(candidates)

  useEffect(() => {
    if (candidates && candidates.length > 0) {
      setAllCandidates(candidates)
    }
  }, [candidates])

  const removeFromList = async (candidateId: string) => {
    try {
      const { data } = await signatureCollectionAdminRemoveCandidateMutation({
        variables: {
          input: {
            candidateId,
            collectionType,
          },
        },
      })

      if (data?.signatureCollectionAdminRemoveCandidate?.success) {
        toast.success(formatMessage(m.unsignFromListSuccess))
        setAllCandidates(allCandidates?.filter((c) => c.id !== candidateId))
        revalidate()
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <Box>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '10/12']}>
          <Box display="flex">
            <Box marginTop={1}>
              <Tag>
                <Box display="flex" justifyContent="center">
                  <Icon icon="people" type="outline" color="blue600" />
                </Box>
              </Tag>
            </Box>
            <Box marginLeft={3}>
              <Text variant="h4">
                {formatMessage(m.reviewCandidatesModalDescription)}
              </Text>
              <Text marginBottom={2}>
                {formatMessage(m.reviewCandidatesDrawerDescription)}
              </Text>
              <Button
                variant="text"
                size="small"
                onClick={() => setModalIsOpen(true)}
              >
                {formatMessage(m.reviewCandidatesModalDescription)}
              </Button>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
      <Modal
        id="reviewCandidatesModal"
        isVisible={modalIsOpen}
        title={formatMessage(m.reviewCandidatesModalDescription)}
        onClose={() => {
          setModalIsOpen(false)
        }}
        hideOnClickOutside={false}
        closeButtonLabel={''}
        label={''}
      >
        <Box marginTop={3} key={candidateInReview?.id}>
          <Table>
            <Head>
              <Row>
                <HeadData></HeadData>
                <HeadData>{formatMessage(m.candidate)}</HeadData>
                <HeadData>{formatMessage(m.nationalId)}</HeadData>
                <HeadData></HeadData>
              </Row>
            </Head>
            <Body>
              {allCandidates.map((candidate, key) => (
                <Row key={candidate.id}>
                  <Data>{key + 1}</Data>
                  <Data>{candidate.name}</Data>
                  <Data>{formatNationalId(candidate.nationalId)}</Data>
                  <Data style={{ display: 'flex', justifyContent: 'end' }}>
                    <Button
                      variant="text"
                      icon="trash"
                      colorScheme="destructive"
                      size="small"
                      onClick={() => {
                        setConfirmModalIsOpen(true)
                        setCandidateInReview(candidate)
                      }}
                    >
                      {formatMessage(m.removeCandidateFromList)}
                    </Button>
                  </Data>
                </Row>
              ))}
            </Body>
          </Table>
        </Box>
      </Modal>
      <Modal
        id="confirmRemoveCandidateFromListModal"
        isVisible={confirmModalIsOpen}
        title={`${candidateInReview?.name} - ${formatMessage(
          m.removeCandidateFromListModalDescription,
        )}`}
        onClose={() => {
          setConfirmModalIsOpen(false)
        }}
        hideOnClickOutside={false}
        closeButtonLabel={''}
        label={''}
      >
        <Text>
          {`${formatMessage(m.confirmRemoveCandidateFromList)} ${
            candidateInReview?.name
          } ?`}
        </Text>
        <Box display="flex" justifyContent="center" marginY={5}>
          <Button
            colorScheme="destructive"
            loading={loading}
            onClick={() => {
              removeFromList(candidateInReview?.id as string)
              setCandidateInReview(undefined)
              setConfirmModalIsOpen(false)
            }}
          >
            {formatMessage(m.removeCandidateFromListButton)}
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default ReviewCandidates
