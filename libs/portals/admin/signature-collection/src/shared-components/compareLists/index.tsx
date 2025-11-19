import {
  Box,
  InputFileUploadDeprecated,
  Text,
  Button,
  Table as T,
  UploadFileDeprecated,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useState } from 'react'
import { Modal } from '@island.is/react/components'
import { useBulkCompareMutation } from './compareLists.generated'
import { format as formatNationalId } from 'kennitala'
import {
  SignatureCollectionCollectionType,
  SignatureCollectionSignature,
} from '@island.is/api/schema'
import { Skeleton } from './skeleton'
import { useUnsignAdminMutation } from './removeSignatureFromList.generated'
import { m } from '../../lib/messages'
import { createFileList, downloadFile, getFileData } from '../../lib/utils'

const { Table, Row, Head, HeadData, Body, Data } = T

const CompareLists = ({
  collectionId,
  collectionType,
  municipalAreaId,
}: {
  collectionId: string
  collectionType: SignatureCollectionCollectionType
  municipalAreaId?: string
}) => {
  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false)
  const [signatureInReview, setSignatureInReview] =
    useState<SignatureCollectionSignature>()

  const [fileList, setFileList] = useState<Array<UploadFileDeprecated>>([])
  const [uploadResults, setUploadResults] =
    useState<Array<SignatureCollectionSignature>>()
  const [compareMutation, { loading }] = useBulkCompareMutation()
  const [unSignMutation] = useUnsignAdminMutation()

  const compareLists = async (nationalIds: string[]) => {
    try {
      const inputCollectionId =
        collectionType === SignatureCollectionCollectionType.LocalGovernmental
          ? municipalAreaId ?? ''
          : collectionId

      const { data } = await compareMutation({
        variables: { input: { collectionId: inputCollectionId, nationalIds } },
      })

      if (data) {
        setUploadResults(
          data.signatureCollectionAdminBulkCompareSignaturesAllLists,
        )
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  const unSignFromList = async (signatureId: string) => {
    try {
      const { data } = await unSignMutation({
        variables: { input: { signatureId, collectionType } },
      })

      const unsignResult = data?.signatureCollectionAdminUnsign

      if (unsignResult?.success) {
        toast.success(formatMessage(m.unsignFromListSuccess))
        setUploadResults(uploadResults?.filter((r) => r.id !== signatureId))
      } else if (unsignResult?.reasons?.length) {
        toast.error(unsignResult.reasons[0])
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  const onChange = async (newFile: File[]) => {
    setFileList(createFileList(newFile, fileList))
    const data = await getFileData(newFile)
    const nationalIds = data.map((d: Record<string, unknown>) => {
      const kennitala = d.Kennitala
      return String(kennitala).replace('-', '')
    })

    compareLists(nationalIds)
  }

  return (
    <Box marginTop={7}>
      <Box
        background="blue100"
        borderRadius="large"
        display={['block', 'flex', 'flex']}
        justifyContent="spaceBetween"
        alignItems="center"
        padding={3}
      >
        <Text marginBottom={[2, 0, 0]} variant="medium" color="blue600">
          {formatMessage(m.compareListsDescription)}
        </Text>
        <Button
          icon="documents"
          iconType="outline"
          variant="ghost"
          size="small"
          onClick={() => setModalIsOpen(true)}
        >
          {formatMessage(m.compareLists)}
        </Button>
      </Box>
      <Modal
        id="compareLists"
        isVisible={modalIsOpen}
        title={formatMessage(m.compareLists)}
        onClose={() => {
          setFileList([])
          setModalIsOpen(false)
        }}
        hideOnClickOutside={false}
        closeButtonLabel={''}
        label={''}
      >
        <Text>{formatMessage(m.compareListsModalDescription)}</Text>
        <Box display="flex" justifyContent="flexEnd" paddingTop={3}>
          <Button
            variant="utility"
            icon="document"
            onClick={() => downloadFile()}
          >
            {formatMessage(m.downloadTemplate)}
          </Button>
        </Box>
        <Box paddingTop={5} paddingBottom={5}>
          <InputFileUploadDeprecated
            fileList={fileList}
            header={formatMessage(m.uploadHeader)}
            description={formatMessage(m.uploadText)}
            buttonLabel={formatMessage(m.uploadButton)}
            onChange={onChange}
            onRemove={() => setFileList([])}
            accept=".xlsx"
            multiple={false}
          />

          {fileList.length > 0 && (
            <Box marginTop={7}>
              <Text variant="h3" marginBottom={1}>
                {formatMessage(m.compareListsResultsHeader)}
              </Text>
              <Text marginBottom={5}>
                {!loading &&
                  formatMessage(
                    uploadResults?.length
                      ? m.compareListsResultsDescription
                      : m.compareListsNoResultsDescription,
                  )}
              </Text>
              <Table>
                <Head>
                  <Row>
                    <HeadData>{formatMessage(m.signeeNationalId)}</HeadData>
                    <HeadData>{formatMessage(m.signeeName)}</HeadData>
                    <HeadData>{formatMessage(m.singleList)}</HeadData>
                    <HeadData></HeadData>
                  </Row>
                </Head>
                <Body>
                  {!loading ? (
                    uploadResults?.map(
                      (result: SignatureCollectionSignature) => (
                        <Row key={result.id}>
                          <Data style={{ minWidth: '140px' }}>
                            {formatNationalId(result.signee.nationalId)}
                          </Data>
                          <Data style={{ minWidth: '250px' }}>
                            {result.signee.name}
                          </Data>
                          <Data>{result.listTitle}</Data>
                          <Data style={{ minWidth: '160px' }}>
                            <Button
                              variant="text"
                              size="small"
                              colorScheme="destructive"
                              onClick={() => {
                                setConfirmModalIsOpen(true)
                                setSignatureInReview(result)
                              }}
                            >
                              {formatMessage(m.unsignFromList)}
                            </Button>
                          </Data>
                        </Row>
                      ),
                    )
                  ) : (
                    <Skeleton />
                  )}
                </Body>
              </Table>
            </Box>
          )}
        </Box>
      </Modal>
      <Modal
        id="confirmRemoveSignatureFromListModal"
        isVisible={confirmModalIsOpen}
        title={`${signatureInReview?.signee?.name ?? ''} - ${formatMessage(
          m.removeSignatureFromListModalDescription,
        )}`}
        onClose={() => {
          setConfirmModalIsOpen(false)
        }}
        hideOnClickOutside={false}
        closeButtonLabel={''}
        label={''}
      >
        <Text>{formatMessage(m.confirmRemoveSignatureFromList)}</Text>
        <Box display="flex" justifyContent="center" marginY={5}>
          <Button
            colorScheme="destructive"
            loading={loading}
            onClick={() => {
              signatureInReview?.id && unSignFromList(signatureInReview.id)
              setSignatureInReview(undefined)
              setConfirmModalIsOpen(false)
            }}
          >
            {formatMessage(m.removeSignatureFromListButton)}
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default CompareLists
