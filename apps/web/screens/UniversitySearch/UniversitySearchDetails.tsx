import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Icon,
  LinkV2,
  Navigation,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { Screen } from '@island.is/web/types'
import { useLinkResolver } from '@island.is/web/hooks'
import {
  GetUniversityGatewayProgramsQuery,
  GetUniversityGatewayProgramsQueryVariables,
  ProgramDetails,
  QueryUniversityGatewayProgramByIdArgs,
} from '@island.is/web/graphql/schema'
import {
  GET_UNIVERSITY_GATEWAY_PROGRAM,
  GET_UNIVERSITY_GATEWAY_PROGRAM_LIST,
} from '../queries/UniversityGateway'
import { CustomNextError } from '@island.is/web/units/errors'
import {
  HeadWithSocialSharing,
  IconTitleCard,
  Sticky,
} from '@island.is/web/components'
import SidebarLayout from '../Layouts/SidebarLayout'

interface UniversityDetailsProps {
  data: ProgramDetails
}

const UniversityDetails: Screen<UniversityDetailsProps> = ({ data }) => {
  console.log('data', data)

  const [isOpen, setIsOpen] = useState<Array<boolean>>([
    false,
    false,
    false,
    false,
  ])

  const toggleIsOpen = (index: number) => {
    const newIsOpen = isOpen.map((x, i) => {
      if (i === index) {
        return !isOpen[index]
      } else return x
    })

    setIsOpen(newIsOpen)
  }

  return (
    <>
      <SidebarLayout
        sidebarContent={
          <Stack space={3}>
            <LinkV2 href="/haskolanam" skipTab>
              <Button
                preTextIcon="arrowBack"
                preTextIconType="filled"
                size="small"
                type="button"
                variant="text"
                truncate
              >
                Til baka í yfirlit
              </Button>
            </LinkV2>
            <IconTitleCard
              heading="asdf"
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              href="/"
              imgSrc="https://www.ru.is/media/HR_logo_hringur_hires.jpg"
              alt="alt text todo"
            />
            <Sticky>
              <Navigation
                baseId="desktopNav"
                colorScheme="purple"
                items={[
                  {
                    title: 'Mentun',
                    active: false,
                    slug: ['/prufa'],
                  },
                ]}
                title="Tengt efni"
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                renderLink={(link, { typename, slug }) => {
                  return (
                    <LinkV2
                      //   href={linkResolver(typename as LinkType, slug).href}
                      href="/"
                      onClick={() => console.log('whuuut')}
                      skipTab
                      pureChildren
                    >
                      {link}
                    </LinkV2>
                  )
                }}
              />
            </Sticky>
          </Stack>
        }
      >
        <Stack space={3}>
          <Hidden above="sm">
            <LinkV2 href="/haskolanam" skipTab>
              <Button
                preTextIcon="arrowBack"
                preTextIconType="filled"
                size="small"
                type="button"
                variant="text"
                truncate
              >
                Til baka í yfirlit
              </Button>
            </LinkV2>
          </Hidden>
          <Text variant="h1" as="h1">
            {data.nameIs}
          </Text>

          <Box marginTop={2}>
            <Text variant="default">{`${data.degreeAbbreviation} - ${data.credits} einingar`}</Text>
            <Text marginTop={3} marginBottom={3} variant="default">
              {data.descriptionIs}
            </Text>
            {data.externalUrlIs && (
              <LinkV2
                href={data.externalUrlIs}
              >{`Sjá nánar á vef ${data.universityId} TODO`}</LinkV2>
            )}
          </Box>
          <Box marginTop={7}>
            <GridContainer>
              <GridRow rowGap={1}>
                <GridColumn span="1/2">
                  <Box display="flex" flexDirection="row">
                    <Box marginRight={1}>
                      <Icon icon={'school'} type="outline" color="blue400" />
                    </Box>
                    <Text variant="medium">{data.degreeType}</Text>
                  </Box>
                </GridColumn>
                <GridColumn span="1/2">
                  <Box display="flex" flexDirection="row">
                    <Box marginRight={1}>
                      <Icon icon={'calendar'} type="outline" color="blue400" />
                    </Box>
                    <Text variant="medium">{`Hefst ${data.startingSemesterSeason} ${data.startingSemesterYear}`}</Text>
                  </Box>
                </GridColumn>

                <GridColumn span="1/2">
                  <Box display="flex" flexDirection="row">
                    <Box marginRight={1}>
                      <Icon icon={'time'} type="outline" color="blue400" />
                    </Box>
                    <Text variant="medium">{`Námstími: ${data.durationInYears} ár`}</Text>
                  </Box>
                </GridColumn>
                <GridColumn span="1/2">
                  <Box display="flex" flexDirection="row">
                    <Box marginRight={1}>
                      <Icon icon={'document'} type="outline" color="blue400" />
                    </Box>
                    <Text variant="medium">{'Inntökupróf: TODO'}</Text>
                  </Box>
                </GridColumn>

                <GridColumn span="1/2">
                  <Box display="flex" flexDirection="row">
                    <Box marginRight={1}>
                      <Icon icon={'wallet'} type="outline" color="blue400" />
                    </Box>
                    <Text variant="medium">
                      {'Árlegt gjald: 75.000 kr. TODO'}
                    </Text>
                  </Box>
                </GridColumn>
                <GridColumn span="1/2">
                  <Box display="flex" flexDirection="row">
                    <Box marginRight={1}>
                      <Icon icon={'calendar'} type="outline" color="blue400" />
                    </Box>
                    <Text variant="medium">{`Umsóknartímabil: ${data.applicationStartDate} - ${data.applicationEndDate}`}</Text>
                  </Box>
                </GridColumn>

                <GridColumn span="1/2">
                  <Box display="flex" flexDirection="row">
                    <Box marginRight={1}>
                      <Icon icon={'person'} type="outline" color="blue400" />
                    </Box>
                    <Text variant="medium">{'Staðnám TODO'}</Text>
                  </Box>
                </GridColumn>
                <GridColumn span="1/2">
                  <Box display="flex" flexDirection="row">
                    <Box marginRight={1}>
                      <Icon icon={'ellipse'} type="outline" color="blue400" />
                    </Box>
                    <Text variant="medium">
                      {'Tungumál: Íslenska / enska TODO'}
                    </Text>
                  </Box>
                </GridColumn>
              </GridRow>
            </GridContainer>
          </Box>
          <Box>
            <Accordion
              singleExpand={false}
              dividerOnTop={false}
              dividerOnBottom={false}
            >
              <AccordionItem
                id="application-rules"
                label="Inntökuskilyrði"
                labelUse="p"
                labelVariant="h3"
                iconVariant="default"
                expanded={isOpen[0]}
                onToggle={() => toggleIsOpen(0)}
              >
                <Text as="p">{data.admissionRequirementsIs}</Text>
              </AccordionItem>
              <AccordionItem
                id="education-requirements"
                label="Námskröfur"
                labelUse="p"
                labelVariant="h3"
                iconVariant="default"
                expanded={isOpen[1]}
                onToggle={() => toggleIsOpen(1)}
              >
                <Text as="p">{data.studyRequirementsIs}</Text>
              </AccordionItem>
              <AccordionItem
                id="education-orginization"
                label="Skipulag náms"
                labelUse="p"
                labelVariant="h3"
                iconVariant="default"
                expanded={isOpen[2]}
                onToggle={() => toggleIsOpen(2)}
              >
                <Text as="p">
                  {data.courses &&
                    data.courses.map((i, index) => {
                      return `${i.nameIs}${
                        index === data.courses.length - 1 ? ', ' : ''
                      }`
                    })}
                </Text>
              </AccordionItem>
              <AccordionItem
                id="annual-cost"
                label="Árlegt gjald"
                labelUse="p"
                labelVariant="h3"
                iconVariant="default"
                expanded={isOpen[3]}
                onToggle={() => toggleIsOpen(3)}
              >
                <Text as="p">{data.costInformationIs}</Text>
              </AccordionItem>
            </Accordion>
          </Box>
        </Stack>
      </SidebarLayout>
    </>
  )
}

UniversityDetails.getProps = async ({ query, apolloClient, locale }) => {
  if (!query?.id) {
    throw new CustomNextError(404, 'Education item was not found')
  }

  const newResponse = await apolloClient.query<any, any>({
    query: GET_UNIVERSITY_GATEWAY_PROGRAM,
    variables: {
      input: {
        id: query.id as string,
      },
    },
  })

  const data = newResponse.data.universityGatewayProgramById

  return {
    data,
  }
}

export default withMainLayout(UniversityDetails)
