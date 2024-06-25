import { Stack, Checkbox, Box, Text } from '@island.is/island-ui/core'
import { useContext, useState } from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import { FormSystemDocumentType } from '@island.is/api/schema'
import { useIntl } from 'react-intl'
import { m } from '../../../../lib/messages'

export const Premises = () => {
  const { control, documentTypes, updateSettings } = useContext(ControlContext)
  const [formDocumentTypes, setFormDocumentTypes] = useState<
    FormSystemDocumentType[]
  >(
    control.form?.documentTypes?.filter(
      (d): d is FormSystemDocumentType => d !== null,
    ) ?? [],
  )

  const handleCheckboxChange = (documentTypeId: number) => {
    if (documentTypeId === -1) return
    const newDocumentTypes = formDocumentTypes.some(
      (f) => f?.id === documentTypeId,
    )
      ? formDocumentTypes.filter((f) => f?.id !== documentTypeId)
      : ([
          ...formDocumentTypes,
          documentTypes?.find((d) => d?.id === documentTypeId),
        ].filter((d) => d !== undefined) as FormSystemDocumentType[])
    setFormDocumentTypes(newDocumentTypes)
    updateSettings({ ...control.form, documentTypes: newDocumentTypes })
  }

  const { formatMessage } = useIntl()

  return (
    <div>
      <Box padding={2} marginBottom={2}>
        <Text variant="h4">{formatMessage(m.premisesTitle)}</Text>
      </Box>
      <Stack space={2}>
        {documentTypes?.map((d, i) => {
          return (
            <Checkbox
              key={i}
              label={d?.name?.is}
              name={d?.name?.is ?? ''}
              subLabel={d?.description?.is}
              rightContent={d?.description?.is}
              value={d?.type ?? ''}
              large
              checked={formDocumentTypes?.some((f) => f?.id === d?.id)}
              onChange={() => handleCheckboxChange(d?.id ?? -1)}
            />
          )
        })}
      </Stack>
    </div>
  )
}
