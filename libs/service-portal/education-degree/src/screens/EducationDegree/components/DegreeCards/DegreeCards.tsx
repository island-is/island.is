import React from 'react'

import { Box } from '@island.is/island-ui/core'
import { EmptyState, m } from '@island.is/service-portal/core'
import { ActionCard } from '@island.is/service-portal/core'

const educationDegrees = [
  {
    programme: 'Viðskiptafræði - MBA',
    school: 'Háskólinn í Reykjavík',
    schoolShortName: 'HR',
    date: '2020-05-25',
  },
  {
    programme: 'Húgbúnaðarverkfræði',
    school: 'Háskóli Íslands',
    schoolShortName: 'HÍ',
    date: '2020-05-25',
  },
  {
    programme: 'Gervigreind',
    school: 'Keilir',
    schoolShortName: 'K',
    date: '2020-05-25',
  },
]

const DegreeCards = () => {
  return (
    <>
      {educationDegrees.map((degree, index) => (
        <Box marginBottom={3} key={index}>
          <ActionCard
            cta={{
              label: 'Sækja skjal',
              variant: 'text',
              size: 'small',
            }}
            tag={{
              label: degree.school,
              variant: 'purple',
              outlined: false,
            }}
            heading={`Leyfisbréf - ${degree.programme}`}
            text={`Dags: ${degree.date}`}
            image={{ type: 'avatar' }}
          />
        </Box>
      ))}
      {educationDegrees.length === 0 && (
        <Box marginTop={[0, 8]}>
          <EmptyState title={m.noDataFound} />
        </Box>
      )}
    </>
  )
}

export default DegreeCards
