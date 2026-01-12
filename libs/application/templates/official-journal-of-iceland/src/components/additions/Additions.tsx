import { getAddition, isAddition, TitlePrefix } from '../../lib/utils'
import {
  Stack,
  Inline,
  Box,
  Button,
  Text,
  Input,
} from '@island.is/island-ui/core'
import { HTMLText } from '@dmr.is/regulations-tools/types'
import { MAXIMUM_ADDITIONS_COUNT } from '../../lib/constants'
import { HTMLEditor } from '../htmlEditor/HTMLEditor'
import { useApplication } from '../../hooks/useUpdateApplication'
import { getValueViaPath } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import { InputFields, OJOIApplication } from '../../lib/types'
import set from 'lodash/set'
import { useLocale } from '@island.is/localization'
import { attachments } from '../../lib/messages'
import { useApplicationAssetUploader } from '../../hooks/useAssetUpload'

type Props = {
  application: OJOIApplication
}

const titlePrefix = TitlePrefix.Appendix

export const Additions = ({ application }: Props) => {
  const { useFileUploader } = useApplicationAssetUploader({
    applicationId: application.id,
  })

  const { formatMessage: f } = useLocale()
  const { setValue } = useFormContext()
  const { updateApplication, application: currentApplication } = useApplication(
    {
      applicationId: application.id,
    },
  )

  const fileUploader = useFileUploader()

  const getAdditions = () => {
    const additions = getValueViaPath(
      currentApplication ? currentApplication.answers : application.answers,
      InputFields.advert.additions,
    )

    return isAddition(additions) ? additions : []
  }

  const onRemoveAddition = (index: number) => {
    const filtered = additions.filter((_, i) => i !== index)
    const mapped = filtered.map((addition, i) => {
      const title = f(attachments.additions.appendixTitle, {
        index: i + 1,
      })

      return {
        ...addition,
        title: title,
      }
    })

    const currentAnswers = structuredClone(currentApplication.answers)

    const updatedAnswers = set(
      currentAnswers,
      InputFields.advert.additions,
      mapped,
    )

    setValue(InputFields.advert.additions, mapped)
    updateApplication(updatedAnswers)
  }

  const onTitleChange = (index: number, value: string) => {
    const currentAnswers = structuredClone(currentApplication.answers)
    const updatedAdditions = additions.map((addition, i) =>
      i === index ? { ...addition, title: value } : addition,
    )

    const updatedAnswers = set(
      currentAnswers,
      InputFields.advert.additions,
      updatedAdditions,
    )

    setValue(InputFields.advert.additions, updatedAdditions)
    updateApplication(updatedAnswers)
  }

  const onAddAddition = () => {
    const currentAnswers = structuredClone(currentApplication.answers)
    let currentAdditions = getValueViaPath(
      currentAnswers,
      InputFields.advert.additions,
    )

    if (!isAddition(currentAdditions)) {
      currentAdditions = []
    }

    // TS not inferring the type after the check above
    if (isAddition(currentAdditions)) {
      const newAddition = getAddition(titlePrefix, additions.length + 1)

      const updatedAdditions = [...currentAdditions, newAddition]
      const updatedAnswers = set(
        currentAnswers,
        InputFields.advert.additions,
        updatedAdditions,
      )

      setValue(InputFields.advert.additions, updatedAdditions)
      updateApplication(updatedAnswers)
    }
  }

  const onAdditionChange = (index: number, value: string) => {
    const currentAnswers = structuredClone(currentApplication.answers)
    const updatedAdditions = additions.map((addition, i) =>
      i === index
        ? { ...addition, content: Buffer.from(value).toString('base64') }
        : addition,
    )

    const updatedAnswers = set(
      currentAnswers,
      InputFields.advert.additions,
      updatedAdditions,
    )

    setValue(InputFields.advert.additions, updatedAdditions)
    updateApplication(updatedAnswers)
  }

  const additions = getAdditions()

  return (
    <Stack space={2}>
      <Text variant="h3">{f(attachments.inputs.radio.title.label)}</Text>
      <Stack space={4}>
        {additions.map((addition, additionIndex) => {
          const currentAddition = additions.at(additionIndex)
          const defaultValue = currentAddition?.content || ''
          return (
            <Box
              key={addition.id}
              border="standard"
              borderRadius="standard"
              padding={2}
            >
              <Stack space={2}>
                <Input
                  name="addition-title"
                  maxLength={100}
                  label="Titill"
                  size="sm"
                  backgroundColor="blue"
                  defaultValue={addition.title}
                  onChange={(e) => onTitleChange(additionIndex, e.target.value)}
                />
                <HTMLEditor
                  controller={false}
                  name="addition"
                  key={addition.id}
                  value={
                    Buffer.from(defaultValue, 'base64').toString(
                      'utf-8',
                    ) as HTMLText
                  }
                  fileUploader={fileUploader()}
                  onChange={(value) => onAdditionChange(additionIndex, value)}
                />
                <Button
                  variant="utility"
                  colorScheme="destructive"
                  icon="trash"
                  iconType="outline"
                  size="small"
                  onClick={() => onRemoveAddition(additionIndex)}
                >
                  {f(attachments.buttons.removeAddition)}
                </Button>
              </Stack>
            </Box>
          )
        })}
        <Box paddingY={2}>
          <Inline space={2} flexWrap="wrap">
            <Button
              disabled={additions.length >= MAXIMUM_ADDITIONS_COUNT}
              variant="utility"
              icon="add"
              size="small"
              onClick={onAddAddition}
            >
              {f(attachments.buttons.addAddition)}
            </Button>
          </Inline>
        </Box>
      </Stack>
    </Stack>
  )
}
