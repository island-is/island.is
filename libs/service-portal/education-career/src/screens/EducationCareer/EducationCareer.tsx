import React from 'react'
import { defineMessage } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { useNamespaces, withClientLocale } from '@island.is/localization'
import { IntroHeader, m } from '@island.is/service-portal/core'
import { CareerCards } from './components/CareerCards'

function EducationCareer(): JSX.Element {
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
      />
      <CareerCards />
    </Box>
  )
}

export default withClientLocale('sp.education-career')(EducationCareer)
