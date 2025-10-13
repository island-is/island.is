import { FormSystemLanguageType } from '@island.is/api/schema'
import { m } from '@island.is/form-system/ui'
import { Box, Button, Input, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useContext } from 'react'
import { ControlContext } from '../../../../../context/ControlContext'

interface Props {
  info: FormSystemLanguageType
  index: number
  changeAdditionalInfo: (
    index: number,
    lang: 'is' | 'en',
    value: string,
  ) => void
  saveAdditionalInfo: () => void
  remove: (index: number) => void
}

export const AdditionalInfo = ({
  info,
  index,
  remove,
  changeAdditionalInfo,
  saveAdditionalInfo,
}: Props) => {
  const { formatMessage } = useLocale()
  const { focus, setFocus, getTranslation } = useContext(ControlContext)
  return (
    <Box
      border="standard"
      borderColor="blue200"
      borderRadius="standard"
      padding={3}
      marginBottom={3}
      key={index}
    >
      <Box
        display="flex"
        justifyContent="flexEnd"
        marginBottom={2}
        width="full"
      >
        <Button
          name={`remove-${index}`}
          variant="ghost"
          colorScheme="destructive"
          onClick={() => remove(index)}
          size="small"
          icon="trash"
        />
      </Box>
      <Stack space={3}>
        <Input
          name={`additionalInfo-is-${info.is}`}
          label={formatMessage(m.icelandic)}
          backgroundColor="blue"
          textarea
          value={info.is || ''}
          onFocus={(e) => setFocus(e.target.value)}
          onChange={(e) => changeAdditionalInfo(index, 'is', e.target.value)}
          onBlur={(e) => e.target.value !== focus && saveAdditionalInfo()}
        />
        <Input
          name={`additionalInfo-en-${info.en}`}
          label={formatMessage(m.english)}
          backgroundColor="blue"
          textarea
          value={info.en || ''}
          onFocus={async (e) => {
            setFocus(e.target.value)
            if (info.en === '' && info.is !== '' && info.is) {
              const translation = await getTranslation(info.is)
              changeAdditionalInfo(index, 'en', translation.translation)
            }
          }}
          onChange={(e) => changeAdditionalInfo(index, 'en', e.target.value)}
          onBlur={(e) => e.target.value !== focus && saveAdditionalInfo()}
        />
      </Stack>
    </Box>
  )
}
