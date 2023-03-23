import { Case } from '../../types/interfaces'
import {
  getDateBeginDateEnd,
  getShortDate,
} from '../../utils/helpers/dateFormatter'
import {
  ActionCard,
  Box,
  Input,
  Text,
  Button,
  InputFileUpload,
  Inline,
  Divider,
  UploadFile,
  fileToObject,
  Hidden,
} from '@island.is/island-ui/core'

import Link from 'next/link'
import { useReducer, useState } from 'react'
import { useLogin } from '@island.is/consultation-portal/utils/helpers'
import { SubscriptionActionBox } from '../Card'

type CardProps = {
  card: Case
  isLoggedIn: boolean
}

enum ActionTypes {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  UPDATE = 'UPDATE',
}

type Action = {
  type: ActionTypes
  payload: any
}

// taken from InputFileUpload.stories.tsx
const uploadFile = (file: UploadFile, dispatch: (action: Action) => void) => {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()

    req.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100)

        dispatch({
          type: ActionTypes.UPDATE,
          payload: { file, status: 'uploading', percent },
        })
      }
    })

    req.upload.addEventListener('load', (event) => {
      dispatch({
        type: ActionTypes.UPDATE,
        payload: { file, status: 'done', percent: 100 },
      })
      resolve(req.response)
    })

    req.upload.addEventListener('error', (event) => {
      dispatch({
        type: ActionTypes.UPDATE,
        payload: { file, status: 'error', percent: 0 },
      })
      reject(req.response)
    })

    const formData = new FormData()
    formData.append('file', file.originalFileObj || '', file.name)

    // TODO: add backend url
    //req.open('POST', 'http://localhost:5000/')
    //req.send(formData)
  })
}

const initialUploadFiles: UploadFile[] = []

function reducer(state: UploadFile[], action: Action) {
  switch (action.type) {
    case ActionTypes.ADD:
      return state.concat(action.payload.newFiles)

    case ActionTypes.REMOVE:
      return state.filter(
        (file) => file.name !== action.payload.fileToRemove.name,
      )

    case ActionTypes.UPDATE:
      return [
        ...state.map((file: UploadFile) => {
          if (file.name === action.payload.file.name) {
            file.status = action.payload.status
            file.percent = action.payload.percent
          }
          return file
        }),
      ]

    default:
      throw new Error()
  }
}

const date = getShortDate(new Date())

export const WriteReviewCard = ({ card, isLoggedIn }: CardProps) => {
  const [showUpload, setShowUpload] = useState<boolean>(false)
  const [state, dispatch] = useReducer(reducer, initialUploadFiles)
  const [error, setError] = useState<string | undefined>(undefined)
  const { LogIn, loginLoading } = useLogin()

  const onChange = (newFiles: File[]) => {
    const newUploadFiles = newFiles.map((f) => fileToObject(f))

    setError(undefined)

    newUploadFiles.forEach((f: UploadFile) => {
      uploadFile(f, dispatch).catch((e) => {
        setError('An error occured uploading one or more files')
      })
    })

    dispatch({
      type: ActionTypes.ADD,
      payload: {
        newFiles: newUploadFiles,
      },
    })
  }

  const onRemove = (fileToRemove: UploadFile) => {
    dispatch({
      type: ActionTypes.REMOVE,
      payload: {
        fileToRemove,
      },
    })
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

      <Text marginBottom={2}>Umsagnaraðili: </Text>
      <Input
        textarea
        label="Umsögn"
        name="Test"
        placeholder="Hér skal skrifa umsögn"
        rows={10}
      />
      <Box paddingTop={3}>
        {showUpload && (
          <Box marginBottom={3}>
            <InputFileUpload
              name="fileUpload"
              fileList={state}
              header="Dragðu skrár hingað til að hlaða upp"
              description="Hlaðaðu upp skrár sem þu vilt senda með þinni umsögn"
              buttonLabel="Velja skrár til að hlaða upp"
              showFileSize
              onChange={onChange}
              onRemove={onRemove}
              errorMessage={state.length > 0 ? error : undefined}
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
          <Button fluid size="small">
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
        cta={{ label: 'Skrá mig inn', onClick: LogIn, isLoading: loginLoading }}
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
