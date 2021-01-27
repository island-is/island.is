import React, { FC, useState } from 'react'
import { useNamespace } from '../../hooks'
import { useQuery } from '@apollo/client'
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
import { Service, GetNamespaceQuery } from '@island.is/web/graphql/schema'

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
  onSelectChange?: (value: SelectOption) => void
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
  //TODO : Set enviroment options
  //When enviroment is chosen we need to set the version options, default is set to newest version.
  //When enviroment is chosen we need to set the serviceDetails object

  //Set version options
  const versionOptions: Array<SelectOption> = service
    ? service.versions.map((x) => {
        // TODO: Change this when we add environmental aware services
        return {
          label: x.versionId.split('-').pop(),
          value: x.details[0].xroadIdentifier,
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
  //sort in descending order, highest version first
  versionOptions.sort((a, b) =>
    a.value.serviceCode < b.value.serviceCode ? 1 : -1,
  )
  // //Get enviroment options
  // const enviromentOptions: Array<SelectOption> = service
  // ? service.versions.map((x) => {
  //     // TODO: Change this when we add environmental aware services
  //     return {
  //       label: x.versionId.split('-').pop(),
  //       value: x.details[0].xroadIdentifier,
  //     }
  //   })
  // : [
  //     {
  //       label: n('noVersion'),
  //       value: {
  //         instance: '',
  //         memberClass: '',
  //         memberCode: '',
  //         serviceCode: '',
  //         subsystemCode: '',
  //       },
  //     },
  //   ]

  // const selectOptionValueToGetOpenApiInput = (
  //   option: SelectOption,
  // ): GetOpenApiInput => {
  //   return option.value
  //     ? option.value
  //     : {
  //         instance: '',
  //         memberClass: '',
  //         memberCode: '',
  //         serviceCode: '',
  //         subsystemCode: '',
  //       }
  // }
  const [selectedVersionOption, setSelectedVersionOption] = useState<
    SelectOption
  >(versionOptions[0])

  const onSelectVersion = (option: SelectOption) => {
    onSelectChange(option)
  }

  return (
    // Heading
    <Box>
      <Box marginTop={1} marginBottom={3}>
        <Box display="flex" alignItems="flexStart">
          <Text variant="h1" as="h1">
            {service.title}
          </Text>
          {service.pricing.length > 0 && (
            <Box marginLeft={1}>
              <Tag>{n(`pricing${capitalize(service.pricing[0])}`)}</Tag>
            </Box>
          )}
        </Box>
        <Text variant="intro" paddingTop={2}>
          {service.description}
        </Text>
      </Box>

      <Box paddingBottom={3}>
        <Divider />
      </Box>

      <Box
        display="flex"
        flexDirection={['column', 'row']}
        justifyContent={['flexStart', 'spaceBetween']}
      >
        <Box display="flex">
          <Box className={styles.selectDesktop}>
            <Select
              backgroundColor="blue"
              size="sm"
              label={n('XroadIdentifierInstance')}
              name="Instance"
              disabled={versionOptions.length < 2}
              isSearchable={false}
              defaultValue={selectedVersionOption}
              options={versionOptions}
              //onChange={onSelectInstance}
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

        <Box
          paddingTop={[2, 0]}
          display="flex"
          alignItems="center"
          justifyContent={['flexStart', 'flexEnd']}
        >
          <Box paddingRight={[3, 2]}>
            <Link href={service.versions[2].details[0].links.bugReport}>
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
          <Box>
            <Link href={service.versions[2].details[0].links.featureRequest}>
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
        </Box>
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
        {/* {service && service && service.xroadIdentifier.length > 0 && ( */}
        <Box paddingX={3} marginBottom={2}>
          <Inline space={1}>
            <Text color="blue600">
              {`${n('XroadIdentifierSubsystemCode')}:`}
            </Text>
            <Text color="blue600" fontWeight="semiBold">
              {/* {service.xroadIdentifier[0].subsystemCode} */} test
            </Text>
          </Inline>
          <Box marginTop={1} display="flex">
            <Inline space={1}>
              {/* IdentifierInstance */}
              <XroadValue
                value="test"
                label={`${n('XroadIdentifierInstance')}:`}
                // value={service.xroadIdentifier[0].instance}
                showDivider
              />
              {/* memberCode */}
              <XroadValue
                label={`${n('XroadIdentifierMemberCode')}:`}
                value="test"
                // value={service.xroadIdentifier[0].memberCode}
                showDivider
              />
              {/* memberClass */}
              <XroadValue
                label={`${n('XroadIdentifierMemberClass')}:`}
                value="test"
                // value={service.xroadIdentifier[0].memberClass}
                showDivider
              />
              {/* serviceCode */}
              <XroadValue
                label={`${n('XroadIdentifierServiceCode')}:`}
                value="test"
                // value={service.xroadIdentifier[0].serviceCode}
                showDivider={false}
              />
            </Inline>
          </Box>
        </Box>
        {/* )} */}
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
        {/* Links */}
        <ServiceInfoLink
          href={service.versions[2].details[0].links.documentation}
          link={n('linkDocumentation')}
        />
        <ServiceInfoLink
          href={service.versions[2].details[0].links.bugReport}
          link={n('linkResponsible')}
        />
      </Inline>
    </Box>
  )
}
