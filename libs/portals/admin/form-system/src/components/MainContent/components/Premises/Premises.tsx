import { Stack, Checkbox, Box, Text } from '@island.is/island-ui/core'
import { useContext, useState } from 'react'
import ControlContext from '../../../../context/ControlContext'
import { FormSystemDocumentType } from '@island.is/api/schema'

const Premises = () => {
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

  return (
    <Box>
      <Box padding={2} marginBottom={2}>
        <Text variant="h4">
          Í þessu skrefi óskum við eftir samþykki fyrir því að upplýsingar um
          hlutaðeigandi aðila verði sóttar af Mínum síðum. Að auki er hægt að
          óska eftir heimild fyrir því að einhver af eftirfarandi vottorðum
          verði sótt í viðeigandi vefþjónustur
        </Text>
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
    </Box>
  )
}

export default Premises
