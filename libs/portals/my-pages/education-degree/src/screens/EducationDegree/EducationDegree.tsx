import { defineMessage } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { useNamespaces } from '@island.is/localization'
import {
  FootNote,
  IntroHeader,
  MMS_SLUG,
} from '@island.is/portals/my-pages/core'
import { DegreeCards } from './components/DegreeCards'

function EducationDegree() {
  useNamespaces('sp.education-degree')

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={defineMessage({
          id: 'sp.education-degree:education-degree-title',
          defaultMessage: 'Prófskírteini',
        })}
        intro={defineMessage({
          id: 'sp.education-degree:education-degree-intro',
          defaultMessage:
            'Hér getur þú fundið yfirlit yfir prófskírteini og lokapróf á öllum námsstigum.',
        })}
        img="./assets/images/educationGrades.svg"
        serviceProviderSlug={MMS_SLUG}
      />
      <DegreeCards />
      <FootNote serviceProviderSlug={MMS_SLUG} />
    </Box>
  )
}

export default EducationDegree
