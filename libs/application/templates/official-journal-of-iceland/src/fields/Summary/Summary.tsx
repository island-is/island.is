import { useUserInfo } from '@island.is/auth/react'
import { Box, Stack } from '@island.is/island-ui/core'
import { FormIntro } from '../../components/FormIntro/FormIntro'
import { Property } from '../../components/Property/Property'
import { useFormatMessage } from '../../hooks'
import { summary } from '../../lib/messages'
import { OJOIFieldBaseProps } from '../../lib/types'

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

export const Summary = ({ application }: OJOIFieldBaseProps) => {
  const { f } = useFormatMessage(application)

  const user = useUserInfo()

  return (
    <Box>
      <FormIntro
        title={f(summary.general.formTitle)}
        intro={f(summary.general.formIntro)}
      />
      <Stack space={0} dividers>
        <Property
          name={f(summary.properties.sender)}
          value={user.profile.name}
        />
        <Property name={f(summary.properties.type)} value={MOCK_DATA.type} />
        <Property
          name={f(summary.properties.title)}
          value={MOCK_DATA.caseTitle}
        />
        <Property
          name={f(summary.properties.department)}
          value={MOCK_DATA.caseDepartment}
        />
        <Property
          name={f(summary.properties.submissionDate)}
          value={MOCK_DATA.dateOfSubmission}
        />
        <Property
          name={f(summary.properties.fastTrack)}
          value={MOCK_DATA.caseFastTrack}
        />
        <Property
          name={f(summary.properties.estimatedDate)}
          value={MOCK_DATA.estimatedDateOfPublication}
        />
        <Property
          name={f(summary.properties.estimatedPrice)}
          value={MOCK_DATA.estimatedPrice}
        />
        <Property
          name={f(summary.properties.classification)}
          value={MOCK_DATA.caseClassicifation}
        />
      </Stack>
    </Box>
  )
}

export default Summary
