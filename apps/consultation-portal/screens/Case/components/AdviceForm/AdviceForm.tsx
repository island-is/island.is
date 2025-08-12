import { useContext, useState } from 'react'
import { PresignedPost } from '@island.is/api/schema'
import { Case } from '../../../../types/interfaces'
import {
  getDateBeginDateEnd,
  getShortDate,
} from '../../../../utils/helpers/dateFunctions'
import {
  Box,
  Input,
  Text,
  Button,
  InputFileUploadDeprecated,
  Inline,
  Divider,
  UploadFileDeprecated,
  fileToObjectDeprecated,
  toast,
  Checkbox,
  Stack,
} from '@island.is/island-ui/core'
import { useIsMobile, useLogIn, usePostAdvice } from '../../../../hooks'
import {
  REVIEW_FILENAME_MAXIMUM_LENGTH,
  REVIEW_MAXIMUM_LENGTH,
  REVIEW_MINIMUM_LENGTH,
} from '../../../../utils/consts/consts'
import { AgencyText, ActionBox } from './components/'
import { createUUIDString } from '../../../../utils/helpers'
import { advicePublishTypeKeyHelper } from '../../../../types/enums'
import localization from '../../Case.json'
import sharedLocalization from '../../../../lib/shared.json'
import { UserContext } from '../../../../context'
import { CaseStatusText } from '../../components'

interface Props {
  case: Case
  refetchAdvices: any
}

const fileExtensionWhitelist = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx':
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

const date = getShortDate(new Date())

export const AdviceForm = ({ case: _case, refetchAdvices }: Props) => {
  const { isMobile } = useIsMobile()
  const { isAuthenticated, user } = useContext(UserContext)
  const LogIn = useLogIn()
  const [review, setReview] = useState('')
  const [showInputError, setShowInputError] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [fileList, setFileList] = useState<Array<UploadFileDeprecated>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showInputFileError, setShowInputFileError] = useState(false)
  const [inputFileErrorText, setInputFileErrorText] = useState('')
  const loc = localization['adviceForm']
  const sloc = sharedLocalization['publishingRules']
  const { createUploadUrl, postAdviceMutation } = usePostAdvice()
  const [privateAdvice, setPrivateAdvice] = useState(false)

  const handlePrivateChange = () => setPrivateAdvice(!privateAdvice)

  const uploadFile = async (
    file: UploadFileDeprecated,
    response: PresignedPost,
  ) => {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.withCredentials = true
      request.responseType = 'json'

      request.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          file.percent = (event.loaded / event.total) * 100
          file.status = 'uploading'

          const withoutThisFile = fileList.filter((f) => f.key !== file.key)
          const newFileList = [...withoutThisFile, file]
          setFileList(newFileList)
        }
      })

      request.upload.addEventListener('error', () => {
        file.percent = 0
        file.status = 'error'

        const withoutThisFile = fileList.filter((f) => f.key !== file.key)
        const newFileList = [...withoutThisFile, file]
        setFileList(newFileList)
        reject()
      })
      request.open('POST', response.url)

      const formData = new FormData()

      Object.keys(response.fields).forEach((key) =>
        formData.append(key, response.fields[key]),
      )
      formData.append('file', file.originalFileObj as File)

      request.setRequestHeader('x-amz-acl', 'bucket-owner-full-control')

      request.onload = () => {
        resolve(request.response)
      }

      request.onerror = () => {
        reject()
      }
      request.send(formData)
    })
  }

  const onClick = async () => {
    setIsSubmitting(true)

    if (
      review.length >= REVIEW_MINIMUM_LENGTH &&
      review.length <= REVIEW_MAXIMUM_LENGTH
    ) {
      setShowInputError(false)
      const fileListCheck = fileList.filter((file) => {
        const indexOfDot = file.name.lastIndexOf('.')
        const fileName = file.name.substring(0, indexOfDot)
        return fileName.length > REVIEW_FILENAME_MAXIMUM_LENGTH
      })
      if (fileListCheck.length > 0) {
        setShowInputFileError(true)
        setInputFileErrorText(loc.inputFileErrorText)
        toast.error(loc.inputFileErrorText)
      } else {
        setShowInputFileError(false)
        setInputFileErrorText('')
        const mappedFileList = await Promise.all(
          fileList.map((file) => {
            return new Promise((resolve, reject) => {
              createUploadUrl({
                variables: {
                  filename: file.name,
                },
              })
                .then((response) => {
                  uploadFile(file, response.data.createUploadUrl)
                    .then(() => {
                      resolve(response.data.createUploadUrl.fields.key)
                    })
                    .catch(() => reject())
                })
                .catch(() => reject())
            })
          }),
        )
        const objToSend = {
          caseId: _case?.id,
          postCaseAdviceCommand: {
            content: review,
            fileUrls: mappedFileList,
            privateAdvice: privateAdvice,
          },
        }

        await postAdviceMutation({
          variables: {
            input: objToSend,
          },
        })
          .then(() => {
            setReview('')
            setFileList([])
            refetchAdvices()
            toast.success(loc.postAdviceMutationToasts.success)
          })
          .catch(() => toast.error(loc.postAdviceMutationToasts.failure))
      }
    } else {
      setShowInputError(true)
    }
    setIsSubmitting(false)
  }

  const onChange = (files: File[]) => {
    const uploadFiles = files.map((file) => fileToObjectDeprecated(file))
    const uploadFilesWithKey = uploadFiles.map((f) => ({
      ...f,
      key: createUUIDString(),
    }))
    const newFileList = [...fileList, ...uploadFilesWithKey]
    setFileList(newFileList)
  }

  const onRemove = (fileToRemove: UploadFileDeprecated) => {
    const newFileList = fileList.filter((file) => file.key !== fileToRemove.key)
    setFileList(newFileList)
  }
  const shouldDisplayHidden =
    _case.allowUsersToSendPrivateAdvices &&
    advicePublishTypeKeyHelper[_case.advicePublishTypeId] !== 'publishNever'

  return isAuthenticated ? (
    <Box
      paddingY={3}
      paddingX={[2, 2, 4, 4, 4]}
      borderRadius="standard"
      borderWidth="standard"
      borderColor="blue300"
      flexDirection="column"
      id="write-review"
    >
      <Inline
        justifyContent="spaceBetween"
        alignY={['top', 'top', 'top', 'center', 'center']}
        flexWrap="nowrap"
      >
        <Inline alignY="center" collapseBelow="lg">
          <Text variant="eyebrow" color="purple400">
            {`${loc.card.eyebrowText} S-${_case.caseNumber}`}
          </Text>
          {!isMobile && (
            <Box style={{ transform: 'rotate(90deg)', width: 16 }}>
              <Divider weight="purple400" />
            </Box>
          )}
          <Box>
            <Text variant="eyebrow" color="purple400">
              {`${loc.card.forReviewText}: ${getDateBeginDateEnd(
                _case.processBegins,
                _case.processEnds,
              )}`}
            </Text>
          </Box>
        </Inline>
        <Text variant="small">{date}</Text>
      </Inline>
      <Text as="h3" variant="h3" marginTop={1}>
        {loc.card.title}
      </Text>

      <Text marginBottom={2}>
        <CaseStatusText
          isAdviceForm
          sloc={sloc}
          status={_case.statusName}
          shouldDisplayHidden={shouldDisplayHidden}
          advicePublishTypeId={_case.advicePublishTypeId}
          linkProps={{
            href: sloc.publishLaw.link.href,
            label: sloc.publishLaw.link.label,
          }}
          textBefore={loc.card.description.textBefore}
        />
      </Text>

      <Text marginBottom={2}>
        {loc.card.description.user}: {user?.name}
      </Text>

      <Input
        textarea
        label={loc.input.label}
        name="review_input"
        placeholder={loc.input.placeholder}
        rows={10}
        value={review}
        onChange={(e) => setReview(e.target.value)}
        hasError={
          showInputError &&
          (review.length < REVIEW_MINIMUM_LENGTH ||
            review.length > REVIEW_MAXIMUM_LENGTH)
        }
        errorMessage={
          review.length < REVIEW_MINIMUM_LENGTH
            ? `${loc.input.minLenght} ${review.length.toLocaleString(
                'de-DE',
              )} ${loc.input.lengthUnit}`
            : `${loc.input.maxLength} ${review.length.toLocaleString(
                'de-DE',
              )} ${loc.input.lengthUnit}`
        }
      />
      <Box paddingTop={3}>
        <Stack space={3}>
          {showUpload && (
            <InputFileUploadDeprecated
              name="fileUpload"
              fileList={fileList}
              accept={Object.values(fileExtensionWhitelist)}
              header={loc.inputFileUpload.header}
              description={loc.inputFileUpload.description}
              buttonLabel={loc.inputFileUpload.buttonLabel}
              showFileSize
              onChange={onChange}
              onRemove={onRemove}
              maxSize={10000000}
              errorMessage={showInputFileError && inputFileErrorText}
            />
          )}
          {_case.allowUsersToSendPrivateAdvices && (
            <Checkbox
              checked={privateAdvice}
              onChange={() => handlePrivateChange()}
              label={loc.privateLabel}
            />
          )}
          <Inline space={2} justifyContent="spaceBetween" collapseBelow="md">
            {!showUpload ? (
              <Button
                fluid
                size="small"
                icon="documents"
                iconType="outline"
                variant="ghost"
                onClick={() => setShowUpload(true)}
              >
                {loc.showUploadButtonLabel}
              </Button>
            ) : (
              <div />
            )}
            <Button fluid size="small" onClick={onClick} loading={isSubmitting}>
              {loc.submitAdviceButtonLabel}
            </Button>
          </Inline>
        </Stack>
      </Box>
      <Text marginTop={2} variant="small">
        {loc.allowedFilesText}
      </Text>
      <AgencyText />
    </Box>
  ) : (
    <>
      <ActionBox
        heading={loc.loginActionBox.heading}
        text={loc.loginActionBox.text}
        cta={{ label: loc.loginActionBox.ctaLabel, onClick: LogIn }}
      />
      <AgencyText />
    </>
  )
}

export default AdviceForm
