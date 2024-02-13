import React, { useContext, useState } from 'react'
import { Stack, Checkbox, Box, Text } from '@island.is/island-ui/core'
import FormBuilderContext from '../../../../context/FormBuilderContext'
import { ICertificate } from '../../../../types/interfaces'

export default function Premises() {
  const { formBuilder, formDispatch } = useContext(FormBuilderContext)
  const { documentTypes } = formBuilder
  const [formDocumentTypes, setFormDocumentTypes] = useState<ICertificate[]>(
    formBuilder.form.documentTypes,
  )

  return formBuilder ? (
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
        {formBuilder.documentTypes.map((d, i) => {
          return (
            <Checkbox
              key={i}
              label={d.name.is}
              name={d.name.is}
              subLabel={d.description.is}
              rightContent={d.description.is}
              value={d.type}
              large
              checked={formDocumentTypes.some((f) => f?.id === d.id)}
              onChange={() => handleCheckboxChange(d.id)}
            />
          )
        })}
      </Stack>
    </Box>
  ) : null

  function handleCheckboxChange(documentTypeId: number) {
    const newDocumentTypes = formDocumentTypes.some(
      (f) => f.id === documentTypeId,
    )
      ? formDocumentTypes.filter((f) => f.id !== documentTypeId)
      : [
          ...formDocumentTypes,
          documentTypes.find((d) => d.id === documentTypeId),
        ]
    setFormDocumentTypes(newDocumentTypes)
    formDispatch({
      type: 'updateDocuments',
      payload: {
        documents: newDocumentTypes,
      },
    })
  }
}
