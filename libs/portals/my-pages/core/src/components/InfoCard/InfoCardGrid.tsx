import { GridColumn, GridContainer, GridRow } from '@island.is/island-ui/core'
import React from 'react'
import InfoCard, { InfoCardProps } from './InfoCard'
interface InfoCardGridProps {
  cards: InfoCardProps[]
  size?: 'small' | 'large'
}

export const InfoCardGrid: React.FC<InfoCardGridProps> = ({ cards, size }) => {
  return (
    <GridContainer>
      <GridRow rowGap={2}>
        {cards.map((card, index) => (
          <GridColumn span={size === 'small' ? '6/12' : '12/12'}>
            <InfoCard
              icon={card.icon}
              key={index}
              tags={card.tags}
              img={card.img}
              size={card.size}
              title={card.title}
              description={card.description}
              to={card.to}
              detail={card.detail}
            />
          </GridColumn>
        ))}
      </GridRow>
    </GridContainer>
  )
}

export default InfoCardGrid
