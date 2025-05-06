import { defineMessage } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  FootNote,
  IntroHeader,
  MMS_SLUG,
  m,
} from '@island.is/portals/my-pages/core'
import { CareerCards } from './components/CareerCards'

const EducationCareer = () => {
  useNamespaces('sp.education-career')
  const { formatMessage } = useLocale()

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={m.educationCareer}
        intro={defineMessage({
          id: 'sp.education-career:education-career-intro',
          defaultMessage:
            'Hér birtast einkunnir þínar og barna þinna úr samræmdum prófum frá árinu 2020 sem sóttar eru til Menntamálastofnunar. Unnið er að því að því að koma öllum einkunnum úr menntakerfi Íslands á einn stað.',
          description: 'education career intro',
        })}
        serviceProviderSlug={MMS_SLUG}
        serviceProviderTooltip={formatMessage(m.mmsTooltip)}
      />
      <CareerCards />
      <FootNote serviceProviderSlug={MMS_SLUG} />
    </Box>
  )
}

export default EducationCareer
