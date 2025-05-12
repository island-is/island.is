import { useState } from 'react'
import {
  convertNumberToRoman,
  getAddition,
  isAddition,
  TitlePrefix,
} from '../../lib/utils'
import { additionSchema } from '../../lib/dataSchema'
import {
  Stack,
  Inline,
  RadioButton,
  Box,
  Button,
  Text,
} from '@island.is/island-ui/core'
import { HTMLText } from '@island.is/regulations-tools/types'
import { z } from 'zod'
import {
  DEFAULT_ADDITIONS_COUNT,
  MAXIMUM_ADDITIONS_COUNT,
} from '../../lib/constants'
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

type Addition = z.infer<typeof additionSchema>[number]

export const Additions = ({ application }: Props) => {
  const [asRoman, setAsRoman] = useState<boolean>(
    application.answers.misc?.asRoman ?? false,
  )
  const [titlePrefix, setTitlePrefix] = useState<TitlePrefix>(
    application.answers.misc?.titlePrefix ?? TitlePrefix.Appendix,
  )

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

    return isAddition(additions)
      ? additions
      : [getAddition(titlePrefix, DEFAULT_ADDITIONS_COUNT, false)]
  }

  const onRemoveAddition = (index: number) => {
    const filtered = additions.filter((_, i) => i !== index)
    const mapped = filtered.map((addition, i) => {
      const title = f(
        titlePrefix === TitlePrefix.Appendix
          ? attachments.additions.appendixTitle
          : attachments.additions.attachmentTitle,
        {
          index: asRoman ? convertNumberToRoman(i + 1) : i + 1,
        },
      )

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

  const onTitleChange = (titlePrefix: TitlePrefix, roman: boolean) => {
    const handleTitleChange = (addition: Addition, i: number) => {
      const title = f(
        titlePrefix === TitlePrefix.Appendix
          ? attachments.additions.appendixTitle
          : attachments.additions.attachmentTitle,
        {
          index: roman ? convertNumberToRoman(i + 1) : i + 1,
        },
      )
      return {
        ...addition,
        title: title,
      }
    }

    const currentAnswers = structuredClone(currentApplication.answers)
    const updatedAdditions = additions.map(handleTitleChange)

    let updatedAnswers = set(
      currentAnswers,
      InputFields.advert.additions,
      updatedAdditions,
    )

    updatedAnswers = set(updatedAnswers, InputFields.misc.asRoman, roman)

    setAsRoman(roman)
    setTitlePrefix(titlePrefix)
    setValue(InputFields.advert.additions, updatedAdditions)
    setValue(InputFields.misc.asRoman, roman)
    setValue(InputFields.misc.titlePrefix, titlePrefix)
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
      const newAddition = getAddition(
        titlePrefix,
        additions.length + 1,
        asRoman,
      )

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
      <Inline space={2}>
        <RadioButton
          label={f(attachments.inputs.radio.appendixNumeric.label)}
          name="appendixAsNumbers"
          checked={titlePrefix === TitlePrefix.Appendix && !asRoman}
          onChange={() => onTitleChange(TitlePrefix.Appendix, false)}
        />
        <RadioButton
          label={f(attachments.inputs.radio.appendixRoman.label)}
          name="appendixAsRoman"
          checked={titlePrefix === TitlePrefix.Appendix && asRoman}
          onChange={() => onTitleChange(TitlePrefix.Appendix, true)}
        />
      </Inline>
      <Inline space={2}>
        <RadioButton
          label={f(attachments.inputs.radio.attachmentNumeric.label)}
          name="attachmentAsNumbers"
          checked={titlePrefix === TitlePrefix.Attachment && !asRoman}
          onChange={() => onTitleChange(TitlePrefix.Attachment, false)}
        />
        <RadioButton
          label={f(attachments.inputs.radio.attachmentRoman.label)}
          name="attachmentAsRoman"
          checked={titlePrefix === TitlePrefix.Attachment && asRoman}
          onChange={() => onTitleChange(TitlePrefix.Attachment, true)}
        />
      </Inline>
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
                <Text variant="h3">{addition.title}</Text>
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
      </Stack>
    </Stack>
  )
}
