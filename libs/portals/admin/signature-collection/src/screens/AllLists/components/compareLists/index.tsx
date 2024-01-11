import {
  Box,
  InputFileUpload,
  Text,
  Button,
  Table as T,
  UploadFile,
  toast,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../../../lib/messages'
import { useState } from 'react'
import { Modal } from '@island.is/react/components'
import { useBulkCompareMutation } from './compareLists.generated'
import { format as formatNationalId } from 'kennitala'
import { SignatureCollectionSignature } from '@island.is/api/schema'
import { createFileList, getFileData } from '../../../../lib/utils'
import { Skeleton } from './skeleton'
import { useUnsignAdminMutation } from './removeSignatureFromList.generated'

const CompareLists = () => {
  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [fileList, setFileList] = useState<Array<UploadFile>>([])
  const [uploadResults, setUploadResults] = useState<Array<any>>()
  const [compareMutation, { loading }] = useBulkCompareMutation()
  const [unSignMutation] = useUnsignAdminMutation()

  const compareLists = async (nationalIds: Array<string>) => {
    try {
      const res = await compareMutation({
        variables: {
          input: {
            nationalIds: nationalIds,
          },
        },
      })

      if (res.data) {
        setUploadResults(
          res.data?.signatureCollectionBulkCompareSignaturesAllLists,
        )
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  const unSignFromList = async (signatureId: string) => {
    try {
      const res = await unSignMutation({
        variables: {
          input: {
            id: signatureId,
          },
        },
      })

      if (res.data && res.data.signatureCollectionUnsignAdmin.success) {
        toast.success(formatMessage(m.unsignFromListSuccess))
        setUploadResults(
          uploadResults?.filter((result: SignatureCollectionSignature) => {
            return result.id !== signatureId
          }),
        )
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  const onChange = async (newFile: File[]) => {
    setFileList(createFileList(newFile, fileList))
    let data = await getFileData(newFile)

    data = data.map((d: { Kennitala: any }) => {
      return String(d.Kennitala)
    })

    compareLists(data)
  }

  return (
    <Box marginTop={10}>
      <Box
        background="purple100"
        borderRadius="large"
        display={['block', 'flex', 'flex']}
        justifyContent="spaceBetween"
        alignItems="center"
        padding={3}
      >
        <Text marginBottom={[2, 0, 0]}>
          {formatMessage(m.compareListsDescription)}
        </Text>
        <Button
          icon="documents"
          iconType="outline"
          variant="utility"
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
        <Box paddingTop={5} paddingBottom={5}>
          <InputFileUpload
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
                {formatMessage(
                  uploadResults && uploadResults?.length > 0
                    ? m.compareListsResultsDescription
                    : m.compareListsNoResultsDescription,
                )}
              </Text>
              {uploadResults && uploadResults?.length > 0 && (
                <T.Table>
                  <T.Head>
                    <T.Row>
                      <T.HeadData>
                        {formatMessage(m.signeeNationalId)}
                      </T.HeadData>
                      <T.HeadData>{formatMessage(m.signeeName)}</T.HeadData>
                      <T.HeadData>{formatMessage(m.singleList)}</T.HeadData>
                      <T.HeadData></T.HeadData>
                    </T.Row>
                  </T.Head>
                  <T.Body>
                    {!loading ? (
                      uploadResults?.map(
                        (result: SignatureCollectionSignature, index) => {
                          return (
                            <T.Row key={index}>
                              <T.Data style={{ minWidth: '140px' }}>
                                {formatNationalId(result.signee.nationalId)}
                              </T.Data>
                              <T.Data style={{ minWidth: '250px' }}>
                                {result.signee.name}
                              </T.Data>
                              <T.Data>{'todo: nafn á lista'}</T.Data>
                              <T.Data style={{ minWidth: '160px' }}>
                                <Button
                                  variant="utility"
                                  onClick={() => {
                                    unSignFromList(result.id)
                                  }}
                                >
                                  {formatMessage(m.unsignFromList)}
                                </Button>
                              </T.Data>
                            </T.Row>
                          )
                        },
                      )
                    ) : (
                      <Skeleton />
                    )}
                  </T.Body>
                </T.Table>
              )}
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  )
}

export default CompareLists
