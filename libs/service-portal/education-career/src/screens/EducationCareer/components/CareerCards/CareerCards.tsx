import React from 'react'

import { Button } from '@island.is/island-ui/core'
import { Link } from 'react-router-dom'
import {
  ServicePortalPath,
  EducationCard,
} from '@island.is/service-portal/core'

const CareerCards = () => {
  return (
    <EducationCard
      eyebrow="Menntamálastofnun"
      title="Samræmd könnunarpróf"
      description="Prófár: 2007 - 2014"
      CTA={
        <Link to={ServicePortalPath.EducationStudentAssessment}>
          <Button variant="text" icon="arrowForward" iconType="outline" nowrap>
            Skoða nánar
          </Button>
        </Link>
      }
    />
  )
}

export default CareerCards
