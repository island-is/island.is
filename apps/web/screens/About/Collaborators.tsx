import React, { FC } from 'react'
import { Typography, Box } from '@island.is/island-ui/core'
import * as styles from './Collaborators.treat'

const logos: { [key: string]: string } = {
  aranja: 'Aranja',
  kosmosogkaos: 'Kosmos og kaos',
  andes: 'Andes',
  stefna: 'Stefna',
  parallel: 'Parallel',
  fuglar: 'Fuglar',
  advania: 'Advania',
  sendiradid: 'Sendiráðið',
}

const Collaborators: FC = () => (
  <>
    <Typography variant="h1" as="h2" color="white">
      Samstarf
    </Typography>
    <Box paddingTop={3} paddingBottom={5}>
      <Typography variant="intro" as="p" color="white">
        Stafrænt Ísland er samstarfsgrundvöllur fjölmargra íslenskra fyrirtækja
        sem sérhæfa sig í stafrænni vöruþróun, hugbúnaðargerð og uppbyggingu
        tækniinnviða svo eitthvað sé nefnt.
      </Typography>
    </Box>
    <div className={styles.logos}>
      {Object.entries(logos).map(([k, alt]) => (
        <img
          key={k}
          src={`/logos/${k}.png`}
          alt={alt}
          className={styles.logo}
        />
      ))}
    </div>
  </>
)

export default Collaborators
