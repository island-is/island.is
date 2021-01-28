import React, { FC, useState } from 'react'
import { useNamespace } from '../../hooks'
import {
  Box,
  Inline,
  Tag,
  Text,
  Divider,
  Link,
  Button,
  Select,
} from '@island.is/island-ui/core'
import {
  Service,
  ServiceDetail,
  GetNamespaceQuery,
} from '@island.is/web/graphql/schema'
import TagList from './TagList'
import XroadValue from './XroadValue'
import ServiceInfoLink from './ServiceInfoLink'
import * as styles from './ServiceInformation.treat'

export const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}
export interface ServiceInformationProps {
  service: Service
  strings: GetNamespaceQuery['getNamespace']
  onSelectChange?: (value: ServiceDetail) => void
}

type SelectOption = {
  label: string
  value: any
}

export const ServiceInformation: FC<ServiceInformationProps> = ({
  service,
  strings,
  onSelectChange,
}: ServiceInformationProps) => {
  const n = useNamespace(strings)

  // TODO When enviroment is chosen set the version options, default is set to newest version.
  const enviromentOptions: Array<SelectOption> = service.environments.map(
    (x) => {
      return {
        label: n(x.environment),
        value: x.environment,
      }
    },
  )
  const [selectedEnviromentOption, setSelectedEnviromentOption] = useState<
    SelectOption
  >(enviromentOptions[0])

  const versionOptions: Array<SelectOption> = service
    ? service.environments[0].details.map((x) => {
        // TODO: Change this when we add environmental aware services
        console.log(service)
        return {
          label: x.version,
          value: x.xroadIdentifier,
        }
      })
    : [
        {
          label: n('noVersion'),
          value: {
            instance: '',
            memberClass: '',
            memberCode: '',
            serviceCode: '',
            subsystemCode: '',
          },
        },
      ]

  const [selectedVersionOption, setSelectedVersionOption] = useState<
    SelectOption
  >(versionOptions[0])

  const [serviceDetail, setServiceDetail] = useState<ServiceDetail>(
    service.environments[0].details[0],
  )

  const onSelectVersion = (versionOption: SelectOption) => {
    const tempServiceDetail = service.environments
      .find((e) => e.environment === selectedEnviromentOption.value)
      .details.find((e) => e.xroadIdentifier === versionOption.value)

    setServiceDetail(tempServiceDetail)
    setSelectedVersionOption(versionOption)
    onSelectChange(tempServiceDetail)
  }

  const onSelectEnviroment = (enviromentOption: SelectOption) => {
    //TODO this function needs to be finished similar to onSelectVersion
    setServiceDetail(
      service.environments
        .find((e) => e.environment === enviromentOption.value)
        .details.find(selectedVersionOption.value),
    )
    setSelectedEnviromentOption(enviromentOption)
  }
  return (
    <Box>
      <Box marginTop={1} marginBottom={3}>
        <Box marginBottom={2} display="flex" alignItems="flexStart">
          <Text variant="h1" as="h1">
            {service.title}
          </Text>
          {service.pricing.length > 0 && (
            <Box marginLeft={1}>
              <Tag>{n(`pricing${capitalize(service.pricing[0])}`)}</Tag>
            </Box>
          )}
        </Box>
        {service.summary && (
          <Text variant="intro" paddingBottom={2}>
            {service.summary}
          </Text>
        )}
        {service.description && <Text> {service.description}</Text>}
      </Box>

      <Box paddingBottom={3}>
        <Divider />
      </Box>

      <Box
        display="flex"
        flexDirection={['column', 'column', 'row']}
        justifyContent={['flexStart', 'flexStart', 'spaceBetween']}
      >
        <Box display="flex">
          <Box className={styles.selectDesktop}>
            <Select
              backgroundColor="blue"
              size="sm"
              label={n('XroadIdentifierInstance')}
              name="Instance"
              disabled={enviromentOptions.length < 2}
              isSearchable={false}
              defaultValue={selectedEnviromentOption}
              options={enviromentOptions}
              onChange={onSelectEnviroment}
            />
          </Box>
          <Box marginLeft={2} className={styles.selectDesktop}>
            <Select
              backgroundColor="blue"
              size="sm"
              label={n('version')}
              name="version"
              disabled={versionOptions.length < 2}
              isSearchable={false}
              defaultValue={selectedVersionOption}
              options={versionOptions}
              onChange={onSelectVersion}
            />
          </Box>
        </Box>
        {(serviceDetail.links.bugReport ||
          serviceDetail.links.featureRequest) && (
          <Box
            paddingTop={[3, 3, 0]}
            paddingLeft={[0, 0, 2]}
            display="flex"
            alignItems="center"
            justifyContent={['flexStart', 'flexStart', 'flexEnd']}
          >
            <Inline space={[3, 3, 2]}>
              {serviceDetail.links.bugReport && (
                <Box>
                  <Link href={serviceDetail.links.bugReport}>
                    <Button
                      colorScheme="light"
                      iconType="filled"
                      size="small"
                      type="button"
                      variant="utility"
                      fluid
                    >
                      {n('linkBugReport')}
                    </Button>
                  </Link>
                </Box>
              )}
              {serviceDetail.links.featureRequest && (
                <Box>
                  <Link href={serviceDetail.links.featureRequest}>
                    <Button
                      colorScheme="light"
                      iconType="filled"
                      size="small"
                      type="button"
                      variant="utility"
                    >
                      {n('linkFeatureRequest')}
                    </Button>
                  </Link>
                </Box>
              )}
            </Inline>
          </Box>
        )}
      </Box>

      <Box
        background="blue100"
        paddingY={3}
        marginY={3}
        borderRadius="large"
        display="flex"
        flexDirection="column"
      >
        {/* Xroad values */}
        {serviceDetail.xroadIdentifier && (
          <Box paddingX={3} marginBottom={2}>
            <Inline space={1}>
              <Text color="blue600">
                {`${n('XroadIdentifierSubsystemCode')}:`}
              </Text>
              <Text color="blue600" fontWeight="semiBold">
                {serviceDetail.xroadIdentifier.subsystemCode}
              </Text>
            </Inline>
            <Box marginTop={1} display="flex">
              <Inline space={1}>
                {/* IdentifierInstance */}
                <XroadValue
                  value={serviceDetail.xroadIdentifier.instance}
                  label={`${n('XroadIdentifierInstance')}:`}
                  showDivider
                />
                {/* memberCode */}
                <XroadValue
                  label={`${n('XroadIdentifierMemberCode')}:`}
                  value={serviceDetail.xroadIdentifier.memberCode}
                  showDivider
                />
                {/* memberClass */}
                <XroadValue
                  label={`${n('XroadIdentifierMemberClass')}:`}
                  value={serviceDetail.xroadIdentifier.memberClass}
                  showDivider
                />
                {/* serviceCode */}
                <XroadValue
                  label={`${n('XroadIdentifierServiceCode')}:`}
                  value={serviceDetail.xroadIdentifier.serviceCode}
                  showDivider={false}
                />
              </Inline>
            </Box>
          </Box>
        )}
        <Box paddingBottom={3}>
          <Divider />
        </Box>
        <TagList
          data={service.data}
          type={service.type}
          access={service.access}
          namespace={strings}
        />
      </Box>
      <Inline space={3}>
        {serviceDetail.links.documentation && (
          <ServiceInfoLink
            href={serviceDetail.links.documentation}
            link={n('linkDocumentation')}
          />
        )}
        {serviceDetail.links.responsibleParty && (
          <ServiceInfoLink
            href={serviceDetail.links.responsibleParty}
            link={n('linkResponsible')}
          />
        )}
      </Inline>
    </Box>
  )
}
