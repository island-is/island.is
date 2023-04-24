import { Case } from '../../types/interfaces'
import {
  getDateBeginDateEnd,
  getShortDate,
} from '../../utils/helpers/dateFormatter'
import {
  Box,
  Input,
  Text,
  Button,
  InputFileUpload,
  Inline,
  Divider,
  UploadFile,
  Hidden,
  fileToObject,
  toast,
} from '@island.is/island-ui/core'

import Link from 'next/link'
import { useState } from 'react'
import { useLogIn, usePostAdvice } from '../../utils/helpers'
import { SubscriptionActionBox } from '../Card'
import { PresignedPost } from '@island.is/api/schema'

type CardProps = {
  card: Case
  isLoggedIn: boolean
  username: string
  caseId: number
  refetchAdvices: any
}

const REVIEW_MINIMUM_LENGTH = 10

const fileExtensionWhitelist = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx':
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

const date = getShortDate(new Date())

export const WriteReviewCard = ({
  card,
  isLoggedIn,
  username,
  caseId,
  refetchAdvices,
}: CardProps) => {
  const LogIn = useLogIn()
  const [review, setReview] = useState('')
  const [showInputError, setShowInputError] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [fileList, setFileList] = useState<Array<UploadFile>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { createUploadUrl, postAdviceMutation } = usePostAdvice()

  const uploadFile = async (file: UploadFile, response: PresignedPost) => {
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
    if (review.length > 10) {
      setShowInputError(false)
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
        caseId: caseId,
        caseAdviceCommand: {
          content: review,
          fileUrls: mappedFileList,
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
          toast.success('Umsögn send inn')
        })
        .catch(() => toast.error('Ekki tókst að senda inn umsögn'))
    } else {
      setShowInputError(true)
    }
    setIsSubmitting(false)
  }

  const onChange = (files: File[]) => {
    const uploadFiles = files.map((file) => fileToObject(file))
    const uploadFilesWithKey = uploadFiles.map((f) => ({
      ...f,
      key: crypto.randomUUID(),
    }))
    const newFileList = [...fileList, ...uploadFilesWithKey]
    setFileList(newFileList)
  }

  const onRemove = (fileToRemove: UploadFile) => {
    const newFileList = fileList.filter((file) => file.key !== fileToRemove.key)
    setFileList(newFileList)
  }

  return isLoggedIn ? (
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
            Mál nr. S-{card.caseNumber}
          </Text>
          <Hidden below="lg">
            <Box style={{ transform: 'rotate(90deg)', width: 16 }}>
              <Divider weight="purple400" />
            </Box>
          </Hidden>
          <Box>
            <Text variant="eyebrow" color="purple400">
              Til umsagnar:{' '}
              {getDateBeginDateEnd(card.processBegins, card.processEnds)}
            </Text>
          </Box>
        </Inline>
        <Text variant="small">{date}</Text>
      </Inline>
      <Text variant="h3" marginTop={1}>
        Skrifa umsögn
      </Text>

      <Text marginBottom={2}>
        Hér er hægt að senda inn umsögn. Umsagnir í þessu máli birtast jafnóðum
        og þær berast. Upplýsingalög gilda, sjá nánar í{' '}
        <Link href="/um">um samráðsgáttina.</Link>
      </Text>

      <Text marginBottom={2}>Umsagnaraðili: {username}</Text>

      <Input
        textarea
        label="Umsögn"
        name="Test"
        placeholder="Hér skal skrifa umsögn"
        rows={10}
        value={review}
        onChange={(e) => setReview(e.target.value)}
        hasError={showInputError && review.length <= REVIEW_MINIMUM_LENGTH}
        errorMessage="Texti þarf að vera að minnsta kosti 10 stafbil."
      />
      <Box paddingTop={3}>
        {showUpload && (
          <Box marginBottom={3}>
            <InputFileUpload
              name="fileUpload"
              fileList={fileList}
              accept={Object.values(fileExtensionWhitelist)}
              header="Dragðu skrár hingað til að hlaða upp"
              description="Hlaðaðu upp skrár sem þu vilt senda með þinni umsögn"
              buttonLabel="Velja skrár til að hlaða upp"
              showFileSize
              onChange={onChange}
              onRemove={onRemove}
              maxSize={10000000}
            />
          </Box>
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
              Hlaða upp viðhengi
            </Button>
          ) : (
            <div />
          )}
          <Button fluid size="small" onClick={onClick} loading={isSubmitting}>
            Staðfesta umsögn
          </Button>
        </Inline>
      </Box>
      <Text marginTop={2} variant="small">
        Leyfilegar skráarendingar eru .pdf, .doc og .docx. Hámarksstærð skrár er
        10 MB. Skráarnafn má í mesta lagi vera 100 stafbil.
      </Text>
    </Box>
  ) : (
    <Box>
      <SubscriptionActionBox
        heading="Skrifa umsögn"
        text="Þú verður að vera skráð(ur) inn til þess að geta skrifað umsögn um tillögur."
        cta={{ label: 'Skrá mig inn', onClick: LogIn }}
      />
      <Text marginTop={2}>
        Ef umsögnin er send fyrir hönd samtaka, fyrirtækis eða stofnunar þarf
        umboð þaðan,{' '}
        <a
          target="_blank"
          href="https://samradsgatt.island.is/library/Files/Umbo%C3%B0%20-%20lei%C3%B0beiningar%20fyrir%20samr%C3%A1%C3%B0sg%C3%A1tt%20r%C3%A1%C3%B0uneyta.pdf"
          rel="noopener noreferrer"
        >
          sjá nánar hér.
        </a>
      </Text>
    </Box>
  )
}

export default WriteReviewCard
