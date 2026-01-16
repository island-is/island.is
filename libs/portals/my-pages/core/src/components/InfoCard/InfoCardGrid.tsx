import { GridColumn, GridContainer, GridRow } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import React from 'react'
import { useWindowSize } from 'react-use'
import EmptyCard from './EmptyCard'
import InfoCard, { InfoCardProps } from './InfoCard'
import * as styles from './InfoCard.css'
import { m } from '@island.is/portals/core'
import { useLocale } from '@island.is/localization'

interface InfoCardGridProps {
  cards: (InfoCardProps | null)[]
  size?: 'small' | 'large'
  empty?: {
    title: string
    description?: string
    img?: string
  }
  variant?: 'default' | 'detail' | 'appointment' | 'link'
  error?: boolean
}

export const InfoCardGrid: React.FC<InfoCardGridProps> = ({
  cards,
  size = 'small',
  empty,
  variant = 'default',
  error,
}) => {
  const { width } = useWindowSize()
  const { formatMessage } = useLocale()
  const isMobile = width < theme.breakpoints.md
  const isTablet = width < theme.breakpoints.lg && !isMobile

  return (
    <GridContainer>
      <GridRow rowGap={2} marginBottom={6}>
        {!error && cards.length === 0 && empty ? (
          <GridColumn
            span={size === 'small' && !isMobile && !isTablet ? '6/12' : '12/12'}
            className={styles.gridCard}
            key={`infocard-error`}
          >
            <InfoCard
              title={empty?.title}
              description={empty?.description}
              img={empty?.img}
            />
          </GridColumn>
        ) : (
          cards.filter(Boolean).map((card, index) => (
            <GridColumn
              span={
                size === 'small' && !isMobile && !isTablet ? '6/12' : '12/12'
              }
              className={styles.gridCard}
              key={card?.id ?? `infocard-${index}`}
            >
              {card && (
                <InfoCard
                  tags={card.tags}
                  img={card.img}
                  size={card.size ?? size ?? 'small'}
                  title={error ? formatMessage(m.errorFetch) : card.title}
                  description={card.description}
                  to={error ? undefined : card.to}
                  detail={error ? undefined : card.detail}
                  variant={variant}
                  appointment={card.appointment}
                  loading={card.loading}
                  tooltip={card.tooltip}
                />
              )}
            </GridColumn>
          ))
        )}
      </GridRow>
    </GridContainer>
  )
}

export default InfoCardGrid
