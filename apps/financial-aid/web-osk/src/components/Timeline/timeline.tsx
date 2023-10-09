import React, { useState } from 'react'
import { Text, FormStepper, Box } from '@island.is/island-ui/core'

import {
  ApplicationState,
  getActiveSectionForTimeline,
} from '@island.is/financial-aid/shared/lib'
import format from 'date-fns/format'
import * as styles from './timeline.css'
import cn from 'classnames'

interface Props {
  state: ApplicationState
  modified: string
  created: string
}

const Timeline = ({ state, modified, created }: Props) => {
  const sections = [
    {
      name: 'Umsókn móttekin',
      text: 'Umsóknin verður tekin til úrvinnslu eins fljótt og kostur er.',
      state: [ApplicationState.NEW],
      date: format(new Date(created), 'dd/MM/yyyy HH:mm'),
    },
    {
      name: 'Umsókn í vinnslu',
      text: 'Úrvinnsla umsóknarinnar er hafin. Ef þörf er á frekari upplýsingum eða gögnum mun vinnsluaðili óska eftir því hér á þessari stöðusíðu.',
      state: [ApplicationState.INPROGRESS, ApplicationState.DATANEEDED],
      date: format(new Date(modified), 'dd/MM/yyyy HH:mm'),
    },
    {
      name: 'Niðurstaða',
      text: 'Umsókn verður samþykkt eða henni synjað og umsækjandi látinn vita um niðurstöðuna',
      state: [ApplicationState.REJECTED, ApplicationState.APPROVED],
      date: format(new Date(modified), 'dd/MM/yyyy HH:mm'),
    },
  ]

  const [activeState] = useState(
    sections.findIndex((el) => el.state.includes(state)),
  )

  return (
    <Box marginY={[4, 4, 5]}>
      <Text as="h3" variant="h3" marginBottom={[1, 1, 2]}>
        Umsóknarferlið
      </Text>
      <Text marginBottom={[2, 2, 4]}>
        Hér geturðu séð hvað hefur gerst og hvað er framundan. Hikaðu ekki við
        að senda okkur athugasemd ef þú telur eitthvað óljóst eða rangt.
      </Text>

      {sections.map((item, index) => {
        return (
          <Box
            key={`${index}--${item.text}`}
            className={cn({
              [`${styles.timelineContainer}`]: true,
              [`${styles.activeState}`]: activeState >= index,
              [`${styles.lineDown}`]: index !== sections.length - 1,
            })}
          >
            <Box paddingLeft={3}>
              <Text variant="h5">{item.name}</Text>
              <Text marginBottom={2}>{item.text}</Text>

              <Text variant="small" color="dark300" marginBottom={5}>
                {(index === 0 || index === activeState) && item.date}
              </Text>
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}

export default Timeline
