import { Box, Button, Table as T, toast, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../lib/messages'
import { useEffect, useState } from 'react'
import { Modal } from '@island.is/react/components'
import { useSignatureCollectionAdminRemoveCandidateMutation } from './removeCandidate.generated'
import { SignatureCollectionCandidate } from '@island.is/api/schema'
import { formatNationalId } from '@island.is/portals/core'

const ReviewCandidates = ({
  candidates,
}: {
  candidates: Array<SignatureCollectionCandidate>
}) => {
  const { formatMessage } = useLocale()
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
      const res = await signatureCollectionAdminRemoveCandidateMutation({
        variables: {
          input: {
            candidateId: candidateId,
          },
        },
      })

      if (
        res.data &&
        res.data.signatureCollectionAdminRemoveCandidate.success
      ) {
        toast.success(formatMessage(m.unsignFromListSuccess))
        setAllCandidates(
          allCandidates?.filter((candidate: SignatureCollectionCandidate) => {
            return candidate.id !== candidateId
          }),
        )
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <Box marginTop={8} display="flex" justifyContent="center">
      <Box
        display="flex"
        justifyContent="flexEnd"
        alignItems="flexEnd"
        style={{ minWidth: '150px' }}
      >
        <Button
          variant="text"
          size="small"
          colorScheme="destructive"
          nowrap
          onClick={() => {
            setModalIsOpen(true)
          }}
        >
          {formatMessage(m.reviewCandidatesModalDescription)}
        </Button>
      </Box>
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
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData></T.HeadData>
                <T.HeadData>{formatMessage(m.candidate)}</T.HeadData>
                <T.HeadData>{formatMessage(m.nationalId)}</T.HeadData>
                <T.HeadData></T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {allCandidates.map(
                (candidate: SignatureCollectionCandidate, key) => (
                  <T.Row>
                    <T.Data span={3}>{key + 1}</T.Data>
                    <T.Data span={3}>{candidate.name}</T.Data>
                    <T.Data span={3}>
                      {formatNationalId(candidate.nationalId)}
                    </T.Data>
                    <T.Data style={{ display: 'flex', justifyContent: 'end' }}>
                      <Button
                        variant="utility"
                        icon="trash"
                        onClick={() => {
                          setConfirmModalIsOpen(true)
                          setCandidateInReview(candidate)
                        }}
                      >
                        {formatMessage(m.removeCandidateFromList)}
                      </Button>
                    </T.Data>
                  </T.Row>
                ),
              )}
            </T.Body>
          </T.Table>
        </Box>
      </Modal>
      <Modal
        id="confirmRemoveCandidateFromListModal"
        isVisible={confirmModalIsOpen}
        title={
          candidateInReview?.name +
          ' - ' +
          formatMessage(m.removeCandidateFromListModalDescription)
        }
        onClose={() => {
          setConfirmModalIsOpen(false)
        }}
        hideOnClickOutside={false}
        closeButtonLabel={''}
        label={''}
      >
        <Text>
          {formatMessage(m.confirmRemoveCandidateFromList) +
            ' ' +
            candidateInReview?.name +
            ' ?'}
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
