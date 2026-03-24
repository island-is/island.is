import { FormSystemLanguageType } from '@island.is/api/schema'
import { m } from '@island.is/form-system/ui'
import {
  AlertMessage,
  Box,
  Button,
  Divider,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useContext, useState } from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import { AdditionalInfo } from './components/AdditionalInfo'

export const Completed = () => {
  const {
    control,
    formUpdate,
    controlDispatch,
    focus,
    setFocus,
    getTranslation,
  } = useContext(ControlContext)
  const { isPublished } = control
  const { completedSectionInfo } = control.form
  const { title, confirmationHeader, confirmationText, additionalInfo } =
    completedSectionInfo || {}
  const { formatMessage } = useLocale()
  const [nextSteps, setNextSteps] = useState<FormSystemLanguageType[]>(() =>
    (additionalInfo ?? []).filter(
      (x): x is FormSystemLanguageType => x != null,
    ),
  )

  const add = () => {
    const newSteps = [...nextSteps, { is: '', en: '' }]
    setNextSteps(newSteps)
    controlDispatch({
      type: 'SET_COMPLETED_ADDITIONAL_INFO',
      payload: {
        newValue: newSteps,
        update: formUpdate,
      },
    })
  }

  const remove = (index: number) => {
    const newSteps = nextSteps.filter((_, i) => i !== index)
    setNextSteps(newSteps)
    controlDispatch({
      type: 'SET_COMPLETED_ADDITIONAL_INFO',
      payload: {
        newValue: newSteps,
        update: formUpdate,
      },
    })
  }

  const changeAdditionalInfo = (
    index: number,
    lang: 'is' | 'en',
    value: string,
  ) => {
    const newSteps = nextSteps.map((step, i) =>
      i === index ? { ...step, [lang]: value } : step,
    )
    setNextSteps(newSteps)
  }

  const saveAdditionalInfo = () => {
    controlDispatch({
      type: 'SET_COMPLETED_ADDITIONAL_INFO',
      payload: {
        newValue: nextSteps,
        update: formUpdate,
      },
    })
  }

  return (
    <Stack space={3}>
      <Box marginBottom={4}>
        <Text variant="h3">{formatMessage(m.completedMessage)}</Text>
      </Box>
      <Input
        name="title"
        label={formatMessage(m.completedTitleLabel)}
        backgroundColor="blue"
        readOnly={isPublished}
        value={title?.is || ''}
        onFocus={(e) => setFocus(e.target.value)}
        onChange={(e) => {
          controlDispatch({
            type: 'SET_COMPLETED_TITLE',
            payload: {
              lang: 'is',
              newValue: e.target.value,
            },
          })
        }}
        onBlur={(e) => e.target.value !== focus && formUpdate()}
      />
      <Input
        name="titleEnglish"
        label={formatMessage(m.completedTitleLabelEnglish)}
        backgroundColor="blue"
        value={title?.en || ''}
        readOnly={isPublished}
        onFocus={async (e) => {
          if ((!title?.en || title?.en === '') && title?.is) {
            const translation = await getTranslation(title.is)
            controlDispatch({
              type: 'SET_COMPLETED_TITLE',
              payload: {
                lang: 'en',
                newValue: translation.translation,
              },
            })
          }
          setFocus(e.target.value)
        }}
        onChange={(e) => {
          controlDispatch({
            type: 'SET_COMPLETED_TITLE',
            payload: {
              lang: 'en',
              newValue: e.target.value,
            },
          })
        }}
        onBlur={(e) => {
          if (focus !== e.target.value) {
            formUpdate()
          }
        }}
      />
      <Divider />
      <Box>
        <AlertMessage
          type="success"
          title={confirmationHeader?.is}
          message={<Text whiteSpace="breakSpaces">{confirmationText?.is}</Text>}
        />
      </Box>
      <Input
        name="confirmationHeader"
        label={formatMessage(m.confirmationHeaderLabel)}
        backgroundColor="blue"
        value={confirmationHeader?.is || ''}
        readOnly={isPublished}
        onFocus={(e) => setFocus(e.target.value)}
        onChange={(e) => {
          controlDispatch({
            type: 'SET_COMPLETED_CONFIRMATION_HEADER',
            payload: {
              lang: 'is',
              newValue: e.target.value,
            },
          })
        }}
        onBlur={(e) => e.target.value !== focus && formUpdate()}
      />
      <Input
        name="confirmationHeaderEnglish"
        label={formatMessage(m.confirmationHeaderLabelEnglish)}
        backgroundColor="blue"
        value={confirmationHeader?.en || ''}
        readOnly={isPublished}
        onFocus={async (e) => {
          if (
            (!confirmationHeader?.en || confirmationHeader?.en === '') &&
            confirmationHeader?.is
          ) {
            const translation = await getTranslation(confirmationHeader.is)
            controlDispatch({
              type: 'SET_COMPLETED_CONFIRMATION_HEADER',
              payload: {
                lang: 'en',
                newValue: translation.translation,
              },
            })
          }
          setFocus(e.target.value)
        }}
        onChange={(e) => {
          controlDispatch({
            type: 'SET_COMPLETED_CONFIRMATION_HEADER',
            payload: {
              lang: 'en',
              newValue: e.target.value,
            },
          })
        }}
        onBlur={(e) => {
          if (focus !== e.target.value) {
            formUpdate()
          }
        }}
      />
      <Input
        name="confirmationText"
        label={formatMessage(m.confirmationTextLabel)}
        backgroundColor="blue"
        textarea
        value={confirmationText?.is || ''}
        readOnly={isPublished}
        onFocus={(e) => setFocus(e.target.value)}
        onChange={(e) => {
          controlDispatch({
            type: 'SET_COMPLETED_TEXT',
            payload: {
              lang: 'is',
              newValue: e.target.value,
            },
          })
        }}
        onBlur={(e) => e.target.value !== focus && formUpdate()}
      />
      <Input
        name="confirmationTextEnglish"
        label={formatMessage(m.confirmationTextLabelEnglish)}
        backgroundColor="blue"
        textarea
        value={confirmationText?.en || ''}
        readOnly={isPublished}
        onFocus={async (e) => {
          if (
            (!confirmationText?.en || confirmationText?.en === '') &&
            confirmationText?.is
          ) {
            const translation = await getTranslation(confirmationText.is)
            controlDispatch({
              type: 'SET_COMPLETED_TEXT',
              payload: {
                lang: 'en',
                newValue: translation.translation,
              },
            })
          }
          setFocus(e.target.value)
        }}
        onChange={(e) => {
          controlDispatch({
            type: 'SET_COMPLETED_TEXT',
            payload: {
              lang: 'en',
              newValue: e.target.value,
            },
          })
        }}
        onBlur={(e) => {
          if (focus !== e.target.value) {
            formUpdate()
          }
        }}
      />
      <Divider />
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        alignItems="center"
      >
        <Text variant="h4">{formatMessage(m.completedListHeader)}</Text>
        <Button
          variant="text"
          preTextIcon="add"
          onClick={add}
          disabled={isPublished}
        >
          {formatMessage(m.add)}
        </Button>
      </Box>
      {nextSteps.length > 0 &&
        nextSteps.map((info, index) => (
          <AdditionalInfo
            key={index}
            info={info}
            index={index}
            remove={remove}
            changeAdditionalInfo={changeAdditionalInfo}
            saveAdditionalInfo={saveAdditionalInfo}
          />
        ))}
    </Stack>
  )
}
