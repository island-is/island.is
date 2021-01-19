import React from 'react'

import { RadioController } from '@island.is/shared/form-fields'
import {
  Box,
  Stack,
  Text,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { CustomField, FieldBaseProps } from '@island.is/application/core'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

type Question = {
  id: string
  value: string
}

const QUESTIONS: Question[] = [
  {
    id: 'usesContactGlasses',
    value: '1. Notar þú gleraugu, snertilinsur eða hefur skerta sjón?',
  },
  {
    id: 'hasEpilepsy',
    value:
      '2. Hefur þú verið flogaveik(ur) eða orðið fyrir alvarlegri truflun á meðvitund og stjórn hreyfinga?',
  },
  {
    id: 'hasHeartDisease',
    value: '3. Hefur þú nú eða hefur þú haft alvarlegan hjartasjúkdóm?',
  },
  {
    id: 'hasMentalIllness',
    value: '4. Hefur þú nú eða hefur þú haft alvarlegan geðsjúkdóm?',
  },
  {
    id: 'usesMedicalDrugs',
    value:
      '5. Notar þú að staðaldri læknislyf eða lyfjablöndur sem geta haft áhrif á meðvitund?',
  },
  {
    id: 'isAlcoholic',
    value:
      '6. Ert þú háð(ur) áfengi, ávana- og/eða fíkniefnum eða misnotar þú geðræn lyf sem verkað gætu á meðvitund?',
  },
  {
    id: 'hasDiabetes',
    value: '7. Notar þú insúlín og/eða töflur við sykursýki?',
  },
  {
    id: 'isDisabled',
    value: '8. Hefur þú nú eða hefur þú haft hömlur í hreyfikerfi líkamans?',
  },
  {
    id: 'hasOtherDiseases',
    value:
      '9. Átt þú við einhvern annan sjúkdóm að stríða sem þú telur að geti haft áhrif á öryggi þitt í akstri í framtíðinni?',
  },
]

function HealthDeclaration({
  error,
  field,
  application,
}: PropTypes): JSX.Element {
  return (
    <Box marginTop={4}>
      <Stack space={3}>
        <Text variant="h5">Yfirlýsing um líkamlegt og andlegt heilbrigði</Text>
        {QUESTIONS.map((question) => (
          <GridRow>
            <GridColumn span="9/12">
              <Text>{question.value}</Text>
            </GridColumn>
            <GridColumn span="3/12">
              <RadioController
                id={question.id}
                name={question.id}
                split="1/2"
                options={[
                  { label: 'Já', value: 'true' },
                  { label: 'Nei', value: 'false' },
                ]}
              />
            </GridColumn>
          </GridRow>
        ))}
      </Stack>
    </Box>
  )
}

export default HealthDeclaration
