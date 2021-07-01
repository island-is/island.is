import React from 'react'

import { Box, Button } from '@island.is/island-ui/core'
import { EducationCard, EmptyState, m } from '@island.is/service-portal/core'

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
          <EducationCard
            eyebrow={degree.school}
            imgPlaceholder={degree.schoolShortName}
            title={`Leyfisbréf - ${degree.programme}`}
            description={`Dags: ${degree.date}`}
            CTA={
              <Button variant="text" icon="download" iconType="outline" nowrap>
                Sækja skjal
              </Button>
            }
          />
        </Box>
      ))}
      {educationDegrees.length === 0 && (
        <Box marginTop={8}>
          <EmptyState title={m.noDataFound} />
        </Box>
      )}
    </>
  )
}

export default DegreeCards
