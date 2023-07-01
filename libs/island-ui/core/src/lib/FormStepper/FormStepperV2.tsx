import { FC, ReactElement } from 'react'

import { Box } from '../Box/Box'
import * as styles from './FormStepper.css'

export const FormStepperV2: FC<
  React.PropsWithChildren<{
    sections?: ReactElement[]
  }>
> = ({ sections }) => {
  return (
    <Box width="full">
      {sections ? <Box className={styles.list}>{sections}</Box> : null}
    </Box>
  )
}

export default FormStepperV2
