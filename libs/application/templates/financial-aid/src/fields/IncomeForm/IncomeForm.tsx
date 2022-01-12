import React from 'react'
import { Box, Text, BulletList, Bullet } from '@island.is/island-ui/core'
import { FAFieldBaseProps, ApproveOptions } from '../../lib/types'
import { useIntl } from 'react-intl'
import { incomeForm, approveOptions } from '../../lib/messages'
import * as styles from '../Shared.css'
import cn from 'classnames'
import { RadioController } from '@island.is/shared/form-fields'
import DescriptionText from '../DescriptionText/DescriptionText'

const IncomeForm = ({ field, errors, application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers } = application

  return (
    <>
      <Box marginTop={[2, 2, 3]}>
        <RadioController
          id={field.id}
          defaultValue={answers?.income}
          options={[
            {
              value: ApproveOptions.No,
              label: formatMessage(approveOptions.no),
            },
            {
              value: ApproveOptions.Yes,
              label: formatMessage(approveOptions.yes),
            },
          ]}
          largeButtons
          split="1/2"
          backgroundColor="white"
          error={errors?.income}
        />
      </Box>
      <Text as="h2" variant="h3" marginBottom={2} marginTop={[3, 3, 5]}>
        {formatMessage(incomeForm.bulletList.headline)}
      </Text>
      <Box className={styles.container} marginBottom={5}>
        <DescriptionText text={incomeForm.examplesOfIncome.leftSidedList} />
        <DescriptionText text={incomeForm.examplesOfIncome.rightSidedList} />
      </Box>
    </>
  )
}

export default IncomeForm
