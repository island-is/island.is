import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useParams } from 'react-router-dom'
import { useGetWorkMachineByIdQuery } from './WorkMachinesDetail.generated'
import {
  ErrorScreen,
  ExcludesFalse,
  IntroHeader,
  NotFound,
  TableGrid,
  UserInfoLine,
  formatDate,
  m,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import { format } from 'kennitala'
import chunk from 'lodash/chunk'

type UseParams = {
  id: string
}

const WorkMachinesDetail = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage, locale } = useLocale()
  const { id } = useParams() as UseParams

  const { data, loading, error } = useGetWorkMachineByIdQuery({
    variables: {
      input: {
        id,
        locale,
      },
    },
  })

  if (error) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.workMachines).toLowerCase(),
        })}
      />
    )
  }

  if (!data?.workMachinesWorkMachine && !loading) {
    return <NotFound title={formatMessage(messages.notFound)} />
  }

  const workMachine = data?.workMachinesWorkMachine

  return (
    <>
      <Box marginBottom={[2, 2, 6]}>
        <IntroHeader
          title={workMachine?.type ?? ''}
          intro={workMachine?.registrationNumber ?? ''}
        />
      </Box>
      <Box marginBottom={[2, 2, 6]}>
        <Stack space={2}>
          <Text variant="eyebrow" color="purple400">
            {formatMessage(messages.baseInfoWorkMachineTitle)}
          </Text>
          <UserInfoLine
            label={formatMessage(messages.type)}
            content={workMachine?.type ? workMachine.type.split(' ')[0] : ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(messages.make)}
            content={workMachine?.type ? workMachine.type.split(' ')[1] : ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(messages.mainCategory)}
            content={workMachine?.category ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(messages.subCategory)}
            content={workMachine?.subCategory ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(messages.registrationDate)}
            content={formatDate(workMachine?.registrationDate ?? '')}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(messages.status)}
            content={workMachine?.status ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
      </Box>
      <Box marginBottom={[2, 2, 6]}>
        <TableGrid
          title={formatMessage(messages.baseInfoWorkMachineTitle)}
          dataArray={chunk(
            [
              workMachine?.type && {
                title: formatMessage(messages.type),
                value: workMachine.type.split(' ')[0],
              },
              workMachine?.status && {
                title: formatMessage(messages.status),
                value: workMachine.status,
              },
              workMachine?.type && {
                title: formatMessage(messages.make),
                value: workMachine.type.split(' ')[1],
              },
              workMachine?.category && {
                title: formatMessage(messages.mainCategory),
                value: workMachine.category,
              },
              workMachine?.productionNumber && {
                title: formatMessage(messages.productNumber),
                value: workMachine.productionNumber,
              },
              workMachine?.subCategory && {
                title: formatMessage(messages.subCategory),
                value: workMachine.subCategory,
              },
              workMachine?.productionCountry && {
                title: formatMessage(messages.productCountry),
                value: workMachine.productionCountry,
              },
              workMachine?.productionYear && {
                title: formatMessage(messages.productYear),
                value: workMachine.productionYear.toString(),
              },
              workMachine?.importer && {
                title: formatMessage(messages.importer),
                value: workMachine.importer,
              },
              workMachine?.insurer && {
                title: formatMessage(messages.insurer),
                value: workMachine.insurer,
              },
              workMachine?.registrationDate && {
                title: formatMessage(messages.registrationDate),
                value: formatDate(workMachine.registrationDate),
              },
            ].filter((Boolean as unknown) as ExcludesFalse),
            2,
          )}
          mt
        />
      </Box>
      <Box marginBottom={[2, 2, 6]}>
        <Stack space={2}>
          <Text variant="eyebrow" color="purple400">
            {formatMessage(messages.owner)}
          </Text>
          <UserInfoLine
            label={formatMessage(messages.name)}
            content={workMachine?.ownerName ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(messages.nationalId)}
            content={format(workMachine?.ownerNationalId ?? '')}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(messages.address)}
            content={workMachine?.ownerAddress ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(messages.postalCode)}
            content={workMachine?.ownerPostcode ?? ''}
            loading={loading}
          />
        </Stack>
      </Box>
      <Box marginBottom={[2, 2, 6]}>
        <Stack space={2}>
          <Text variant="eyebrow" color="purple400">
            {formatMessage(messages.operator)}
          </Text>
          <UserInfoLine
            label={formatMessage(messages.name)}
            content={workMachine?.supervisorName ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(messages.nationalId)}
            content={format(workMachine?.supervisorNationalId ?? '')}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(messages.address)}
            content={workMachine?.supervisorAddress ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(messages.subCategory)}
            content={workMachine?.supervisorPostcode ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
      </Box>
    </>
  )
}

export default WorkMachinesDetail
