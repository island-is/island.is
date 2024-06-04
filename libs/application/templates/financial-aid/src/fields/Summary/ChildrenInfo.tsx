import React from 'react'
import { useIntl } from 'react-intl'

import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { summaryForm } from '../../lib/messages'
import { formatNationalId } from '@island.is/financial-aid/shared/lib'
import SummaryBlock from './SummaryBlock'
import { Routes } from '../../lib/constants'

interface Props {
  childrenSchoolInfo: {
    nationalId: string
    school: string
    fullName: string
  }[]
  goToScreen: ((id: string) => void) | undefined
  childrenComment?: string
}

const ChildrenInfo = ({
  childrenSchoolInfo,
  goToScreen,
  childrenComment,
}: Props) => {
  const { formatMessage } = useIntl()

  return (
    <SummaryBlock
      editAction={() => goToScreen?.(Routes.CHILDRENSCHOOLINFO)}
      key="children-block"
    >
      <Box marginBottom={3}>
        <Text fontWeight="semiBold">
          {formatMessage(summaryForm.childrenInfo.title)}
        </Text>
      </Box>

      {childrenSchoolInfo.map((child) => {
        return (
          <ChildInfo
            name={child.fullName}
            nationalId={child.nationalId}
            school={child.school}
          />
        )
      })}
      {childrenComment && (
        <>
          <Text fontWeight="semiBold">
            {formatMessage(summaryForm.childrenInfo.comment)}
          </Text>
          <Text marginTop={2}>{childrenComment}</Text>
        </>
      )}
    </SummaryBlock>
  )
}

interface PropsInfo {
  name?: string
  nationalId?: string
  school?: string
}

const ChildInfo = ({ name, nationalId, school }: PropsInfo) => {
  const { formatMessage } = useIntl()
  return (
    <GridRow marginBottom={3}>
      <GridColumn span={['12/12', '12/12', '6/12', '4/12']}>
        <Box>
          <Text fontWeight="semiBold">
            {formatMessage(summaryForm.childrenInfo.name)}
          </Text>
          <Text>{name}</Text>
        </Box>
      </GridColumn>
      <GridColumn span={['12/12', '12/12', '6/12', '4/12']}>
        <Box marginTop={[3, 3, 0, 0]}>
          <Text fontWeight="semiBold">
            {formatMessage(summaryForm.childrenInfo.nationalId)}
          </Text>
          <Text>{formatNationalId(nationalId ?? '')}</Text>
        </Box>
      </GridColumn>
      <GridColumn span={['12/12', '12/12', '12/12', '4/12']}>
        <Box marginTop={[3, 3, 3, 0]}>
          <Text fontWeight="semiBold">
            {formatMessage(summaryForm.childrenInfo.school)}
          </Text>
          <Text>{school}</Text>
        </Box>
      </GridColumn>
    </GridRow>
  )
}

export default ChildrenInfo
