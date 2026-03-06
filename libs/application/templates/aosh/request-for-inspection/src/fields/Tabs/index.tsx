import { FieldBaseProps } from '@island.is/application/types'
import { Box, Tabs } from '@island.is/island-ui/core'
import { FC } from 'react'
import { AllMachinesField, MyMachinesField } from '../MachinesField'
import { MachinesWithTotalCount } from '@island.is/clients/work-machines'
import { FindAllMachines } from '../MachinesField/FindAllMachines'
import { useFormContext } from 'react-hook-form'
import { information } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

export const TabsField: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application, setSubmitButtonDisabled } = props
  const { formatMessage } = useLocale()
  const machineList = application?.externalData.machinesList
    .data as MachinesWithTotalCount
  const { setValue } = useFormContext()
  const onChangeTab = () => {
    //clear choices
    setValue('machine.id', '')
    //make submit button disabled again
    setSubmitButtonDisabled?.(true)
  }

  return (
    <Box paddingTop={2}>
      {machineList.totalCount > 20 || machineList.totalCount === 0 ? (
        <FindAllMachines {...props} />
      ) : (
        <Tabs
          label=""
          selected={machineList.totalCount > 0 ? 'ownMachines' : 'allMachines'}
          contentBackground="white"
          onChange={onChangeTab}
          tabs={[
            {
              id: 'ownMachines',
              label: formatMessage(
                information.labels.pickMachine.tabMyMachines,
              ),
              content: <MyMachinesField {...props} />,
            },
            {
              id: 'allMachines',
              label: formatMessage(
                information.labels.pickMachine.tabAllMachines,
              ),
              content: <AllMachinesField {...props} />,
            },
          ]}
        ></Tabs>
      )}
    </Box>
  )
}
