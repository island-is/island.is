import { FieldBaseProps } from '@island.is/application/types'
import { useUserInfo } from '@island.is/auth/react'
import { Box, Stack } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { FormIntro } from '../../components/FormIntro/FormIntro'
import { Property } from '../../components/Property/Property'
import { useFormatMessage } from '../../hooks'
import { m } from '../../lib/messages'

const MOCK_DATA = {
  sender: 'Stofnun X',
  type: 'Auglýsing',
  caseTitle:
    'AUGLÝSING um skrá yfir þau störf hjá Múlaþingi sem eru undanskilin verkfallsheimild.',
  caseDepartment: 'B-Deild',
  dateOfSubmission: '25.07.2023',
  caseFastTrack: 'Nei',
  estimatedDateOfPublication: '25.10.2023',
  estimatedPrice: '23.000',
  caseClassicifation: 'Verkföll og vinnudeilur',
}

export const Summary: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { f } = useFormatMessage(application)

  const user = useUserInfo()

  return (
    <Box>
      <FormIntro
        title={f(m.summaryFormTitle)}
        description={f(m.summaryFormIntro)}
      />
      <Stack space={0} dividers>
        <Property name={f(m.summaryPropertySender)} value={user.profile.name} />
        <Property name={f(m.summaryPropertyType)} value={MOCK_DATA.type} />
        <Property
          name={f(m.summaryPropertyCaseTitle)}
          value={MOCK_DATA.caseTitle}
        />
        <Property
          name={f(m.summaryPropertyCaseDepartment)}
          value={MOCK_DATA.caseDepartment}
        />
        <Property
          name={f(m.summaryPropertyDateOfSubmission)}
          value={MOCK_DATA.dateOfSubmission}
        />
        <Property
          name={f(m.summaryPropertyCaseFastTrack)}
          value={MOCK_DATA.caseFastTrack}
        />
        <Property
          name={f(m.summaryPropertyEstimatedDateOfPublication)}
          value={MOCK_DATA.estimatedDateOfPublication}
        />
        <Property
          name={f(m.summaryPropertyEstimatedPrice)}
          value={MOCK_DATA.estimatedPrice}
        />
        <Property
          name={f(m.summaryPropertyCaseClassicifation)}
          value={MOCK_DATA.caseClassicifation}
        />
      </Stack>
    </Box>
  )
}

export default Summary
