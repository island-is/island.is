import React, { useContext } from 'react'
import { Stack, Checkbox, Box, Text } from '@island.is/island-ui/core'
import FormBuilderContext from '../../../../context/FormBuilderContext'

export default function Premises() {
  const { formBuilder, formDispatch } = useContext(FormBuilderContext)

  const newDocuments = (type: string) => {
    const { documentTypes } = formBuilder.form
    console.log('documentTypes', documentTypes)
    if (documentTypes?.includes(type)) {
      if (documentTypes.length === 1) {
        return []
      } else {
        return documentTypes.filter((item) => item !== type)
      }
    }
    return [...documentTypes, type]
  }
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
              subLabel={d.description.is}
              value={d.type}
              large
              checked={formBuilder.form.documentTypes?.includes(d.type)}
              onChange={() =>
                formDispatch({
                  type: 'formSettings',
                  payload: {
                    property: 'documents',
                    value: newDocuments(d.type),
                  },
                })
              }
            />
          )
        })}
      </Stack>
    </Box>
  ) : null
}
