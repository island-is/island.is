import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useParams } from 'react-router-dom'
import { useGetWorkMachineByIdQuery } from './WorkMachinesDetail.generated'
import {
  TableGrid,
  InfoLine,
  formatDate,
  m,
  VINNUEFTIRLITID_SLUG,
  InfoLineStack,
  IntroWrapper,
} from '@island.is/portals/my-pages/core'
import { messages, vehicleMessage } from '../../lib/messages'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Inline,
  IconMapIcon,
  Link,
} from '@island.is/island-ui/core'
import { format } from 'kennitala'
import chunk from 'lodash/chunk'
import { WorkMachinesLink, WorkMachinesLinkType } from '@island.is/api/schema'
import { isDefined } from '@island.is/shared/utils'
import { Problem } from '@island.is/react-spa/shared'

type UseParams = {
  id: string
}

const OrderedLinks = [
  WorkMachinesLinkType.OWNER_CHANGE,
  WorkMachinesLinkType.REQUEST_INSPECTION,
  WorkMachinesLinkType.REGISTER_FOR_TRAFFIC,
  WorkMachinesLinkType.CHANGE_STATUS,
  WorkMachinesLinkType.SUPERVISOR_CHANGE,
]

const WorkMachinesDetail = () => {
  useNamespaces('sp.work-machines')
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

  const workMachine = data?.workMachine

  const createLinks = (links: Array<WorkMachinesLink>) => {
    const generateButton = (
      rel: WorkMachinesLinkType,
      idx: number,
      title?: string,
      url?: string,
    ) => {
      const icon: IconMapIcon =
        rel === WorkMachinesLinkType.CHANGE_STATUS ? 'removeCircle' : 'open'

      const button = (
        <Button
          as={url ? 'span' : undefined}
          size="medium"
          disabled={!url}
          icon={icon}
          iconType="outline"
          variant="utility"
        >
          {title}
        </Button>
      )

      return url ? (
        <Link key={idx} href={url}>
          {button}
        </Link>
      ) : (
        button
      )
    }

    const buttons: Array<React.ReactNode> = []
    const keys = links.map((l) => l.relation).filter(isDefined)

    OrderedLinks.forEach((ol, index) => {
      if (keys.includes(ol)) {
        const link = links.find((link) => link.relation === ol)
        if (link) {
          buttons.push(
            generateButton(
              ol,
              index,
              link.displayTitle ?? '',
              link.href ?? undefined,
            ),
          )
        }
      }
    })
    return buttons
  }

  //transform from [{columnName: string, displayTitle: string}] => { columnName: displayTitle}
  const labels: Record<string, string> = (
    workMachine?.labels?.filter((l) => l.columnName && l.displayTitle) ?? []
  ).reduce(
    (acc, label) => ({
      ...acc,
      [label.columnName ?? '']: label.displayTitle ?? '',
    }),
    {} as Record<string, string>,
  )

  const fullTypeName = workMachine?.type
    ? `${workMachine.type} ${workMachine.model}`.trim()
    : undefined

  return (
    <IntroWrapper
      title={fullTypeName ?? ''}
      serviceProviderSlug={VINNUEFTIRLITID_SLUG}
      serviceProviderTooltip={formatMessage(m.workmachineTooltip)}
    >
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && !loading && !data?.workMachine && (
        <Problem
          type="no_data"
          title={formatMessage(m.noDataFoundVariable, {
            arg: formatMessage(messages.workMachineSingular).toLowerCase(),
          })}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/coffee.svg"
          titleSize="h3"
          noBorder={false}
        />
      )}
      {!error && (loading || data?.workMachine) && (
        <>
          <GridRow marginBottom={2}>
            <GridColumn span="12/12">
              <Box marginBottom={3} paddingRight={2}>
                <Inline space={2}>
                  {workMachine?.links?.length && createLinks(workMachine.links)}
                </Inline>
              </Box>
            </GridColumn>
          </GridRow>
          <Box marginBottom={[2, 2, 6]}>
            <InfoLineStack
              label={formatMessage(messages.baseInfoWorkMachineTitle)}
            >
              <InfoLine
                label={labels.registrationNumber ?? ''}
                content={workMachine?.registrationNumber ?? ''}
                loading={loading}
              />
              <InfoLine
                label={labels.type ?? ''}
                content={fullTypeName ?? ''}
                loading={loading}
              />
              <InfoLine
                label={labels.category ?? ''}
                content={workMachine?.category ?? ''}
                loading={loading}
              />
              <InfoLine
                label={labels.subCategory ?? ''}
                content={workMachine?.subCategory ?? ''}
                loading={loading}
              />
              <InfoLine
                label={labels.dateLastInspection ?? ''}
                content={
                  workMachine?.dateLastInspection
                    ? formatDate(workMachine.dateLastInspection)
                    : formatMessage(messages.noInspection)
                }
                loading={loading}
              />
              <InfoLine
                label={labels.registrationDate ?? ''}
                content={formatDate(workMachine?.registrationDate ?? '')}
                loading={loading}
              />
              <InfoLine
                label={labels.status ?? ''}
                content={workMachine?.status ?? ''}
                loading={loading}
              />
            </InfoLineStack>
          </Box>
          <Box marginBottom={[2, 2, 6]}>
            <TableGrid
              title={formatMessage(messages.baseInfoWorkMachineTitle)}
              dataArray={chunk(
                [
                  fullTypeName
                    ? {
                        title: labels.type,
                        value: fullTypeName,
                      }
                    : undefined,
                  workMachine?.status
                    ? {
                        title: labels.status,
                        value: workMachine.status,
                      }
                    : undefined,
                  workMachine?.category
                    ? {
                        title: labels.category,
                        value: workMachine.category,
                      }
                    : undefined,
                  workMachine?.productionNumber
                    ? {
                        title: labels.productionNumber,
                        value: workMachine.productionNumber,
                      }
                    : undefined,
                  workMachine?.subCategory
                    ? {
                        title: labels.subCategory,
                        value: workMachine.subCategory,
                      }
                    : undefined,
                  workMachine?.productionCountry
                    ? {
                        title: labels.productionCountry,
                        value: workMachine.productionCountry,
                      }
                    : undefined,
                  workMachine?.productionYear
                    ? {
                        title: labels.productionYear,
                        value: workMachine.productionYear.toString(),
                      }
                    : undefined,
                  workMachine?.importer
                    ? {
                        title: labels.importer,
                        value: workMachine.importer,
                      }
                    : undefined,
                  workMachine?.insurer
                    ? {
                        title: labels.insurer,
                        value: workMachine.insurer,
                      }
                    : undefined,
                  workMachine?.registrationDate
                    ? {
                        title: labels.registrationDate,
                        value: formatDate(workMachine.registrationDate),
                      }
                    : undefined,
                ].filter(isDefined),
                2,
              )}
              mt
            />
          </Box>
          <Box marginBottom={[2, 2, 6]}>
            <InfoLineStack label={formatMessage(m.owner)}>
              <InfoLine
                label={labels.ownerName}
                content={workMachine?.owner?.name ?? ''}
                loading={loading}
              />
              <InfoLine
                label={labels.ownerNationalId}
                content={format(workMachine?.owner?.nationalId ?? '')}
                loading={loading}
              />
              <InfoLine
                label={labels.ownerAddress}
                content={workMachine?.owner?.address ?? ''}
                loading={loading}
              />
              <InfoLine
                label={labels.ownerPostcode}
                content={workMachine?.owner?.postcode ?? ''}
                loading={loading}
              />
            </InfoLineStack>
          </Box>
          <Box marginBottom={[2, 2, 6]}>
            <InfoLineStack label={formatMessage(vehicleMessage.operator)}>
              <InfoLine
                label={labels.supervisorName}
                content={workMachine?.supervisor?.name ?? ''}
                loading={loading}
              />
              <InfoLine
                label={labels.supervisorNationalId}
                content={format(workMachine?.supervisor?.nationalId ?? '')}
                loading={loading}
              />
              <InfoLine
                label={labels.supervisorAddress}
                content={workMachine?.supervisor?.address ?? ''}
                loading={loading}
              />
              <InfoLine
                label={labels.supervisorPostcode}
                content={workMachine?.supervisor?.postcode ?? ''}
                loading={loading}
              />
            </InfoLineStack>
          </Box>
        </>
      )}
    </IntroWrapper>
  )
}

export default WorkMachinesDetail
