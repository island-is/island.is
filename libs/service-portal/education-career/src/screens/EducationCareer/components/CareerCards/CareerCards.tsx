import React, { ReactNode } from 'react'

import { Box, Button, Text } from '@island.is/island-ui/core'
import * as styles from './CareerCard.treat'
import { Link } from 'react-router-dom'
import { ServicePortalPath } from '@island.is/service-portal/core'

const CareerCards = () => {
  return (
    <ActionCard
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

interface ActionCard {
  eyebrow?: string
  title?: string
  description?: string
  img?: string
  CTA?: ReactNode
  imgPlaceholder?: string
}

// TODO: Move to a central location, at the moment there are Action cards in use that do not fit our current use case. should look into changing our card or one of the current cards (island-ui, service-portal)
const ActionCard = ({
  eyebrow,
  title,
  description,
  img,
  CTA,
  imgPlaceholder,
}: ActionCard) => {
  return (
    <Box
      display={['block', 'flex']}
      alignItems="center"
      paddingY={[2, 3, 4]}
      paddingX={[2, 3, 4]}
      border="standard"
      borderRadius="large"
    >
      <Box display="flex" alignItems="center">
        {img && <img src={img} alt="" className={styles.img} />}
        {imgPlaceholder && !img && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexShrink={0}
            marginRight={[2, 4]}
            borderRadius="circle"
            background="blue100"
            color="blue400"
            className={styles.img}
          >
            <svg viewBox="0 0 76 76">
              <text
                x="50%"
                y="50%"
                dominant-baseline="middle"
                text-anchor="middle"
                fontSize="32"
                color="inherit"
              >
                {imgPlaceholder}
              </text>
            </svg>
          </Box>
        )}
        <div>
          {eyebrow && (
            <Text variant="eyebrow" color="purple400">
              {eyebrow}
            </Text>
          )}
          {title && (
            <Text variant="h3" as="h3" color="dark400" marginBottom={1}>
              {title}
            </Text>
          )}
          {description && <Text fontWeight="light">{description}</Text>}
        </div>
      </Box>
      {CTA && (
        <Box marginTop={[2, 'auto']} marginLeft="auto" textAlign="right">
          {CTA}
        </Box>
      )}
    </Box>
  )
}

export default CareerCards
