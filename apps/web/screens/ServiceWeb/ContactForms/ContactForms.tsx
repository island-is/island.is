import React, { useState } from 'react'
import NextLink from 'next/link'
import cn from 'classnames'
import {
  Box,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Select,
  Input,
  Text,
  Button,
} from '@island.is/island-ui/core'

import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import GhostForm from './GhostForm'
import { ServiceWebHeader } from '@island.is/web/components'
import * as sharedStyles from '../shared/styles.treat'

const ContactForms = () => {
  const { linkResolver } = useLinkResolver()
  const [isGhostForm, setIsGhostForm] = useState(true)
  const logoTitle = 'Þjónustuvefur Sýslumanna'

  return (
    <>
      <ServiceWebHeader logoTitle={logoTitle} />
      <div className={cn(sharedStyles.bg, sharedStyles.bgSmall)} />
      <Box marginY={[3, 3, 10]}>
        <GridContainer>
          <GridRow>
            <GridColumn
              offset={[null, null, null, '1/12']}
              span={['12/12', '12/12', '12/12', '10/12']}
            >
              <GridContainer>
                <GridRow>
                  <GridColumn span="12/12" paddingBottom={[2, 2, 4]}>
                    <Box printHidden>
                      <Breadcrumbs
                        items={[
                          {
                            title: logoTitle,
                            typename: 'helpdesk',
                            href: '/',
                          },
                          {
                            title: 'Hafðu samband',
                            typename: 'helpdesk',
                            href: '/',
                          },
                        ]}
                        renderLink={(link, { typename, slug }) => {
                          return (
                            <NextLink
                              {...linkResolver(typename as LinkType, slug)}
                              passHref
                            >
                              {link}
                            </NextLink>
                          )
                        }}
                      />
                    </Box>
                  </GridColumn>
                </GridRow>
                <GridRow>
                  <GridColumn span="12/12">
                    <Text variant="h1" as="h1">
                      Hvers efnis er erindið?
                    </Text>
                    <Text marginTop={2} variant="intro">
                      Veldu viðeigandi flokk svo að spurningin rati á réttan
                      stað.
                    </Text>
                  </GridColumn>
                </GridRow>
                <GridRow marginTop={6}>
                  <GridColumn span={['12/12', '12/12', '12/12', '9/12']}>
                    <Select
                      backgroundColor="blue"
                      icon="chevronDown"
                      isSearchable
                      label="Málaflokkur"
                      name="select1"
                      noOptionsMessage="Enginn valmöguleiki"
                      onChange={() => setIsGhostForm(false)}
                      options={[
                        {
                          label: 'Fjölskyldumál',
                          value: '0',
                        },
                        {
                          label: 'Valmöguleiki 2',
                          value: '1',
                        },
                        {
                          label: 'Valmöguleiki 3',
                          value: '2',
                        },
                      ]}
                      placeholder="Veldu flokk"
                      size="md"
                    />
                    {isGhostForm && <GhostForm />}
                    {!isGhostForm && (
                      <>
                        <GridRow>
                          <GridColumn span="12/12" paddingTop={5}>
                            <Input
                              required
                              backgroundColor="blue"
                              label="Þitt nafn"
                              name="Test1"
                            />
                          </GridColumn>
                        </GridRow>
                        <GridRow>
                          <GridColumn span="12/12" paddingTop={5}>
                            <Input
                              required
                              backgroundColor="blue"
                              label="Netfang"
                              name="Test1"
                            />
                          </GridColumn>
                        </GridRow>
                        <GridRow>
                          <GridColumn span="12/12" paddingTop={5}>
                            <Input
                              required
                              backgroundColor="blue"
                              label="Nafn málsaðila"
                              name="Test1"
                            />
                          </GridColumn>
                        </GridRow>
                        <GridRow>
                          <GridColumn span="6/12" paddingTop={5}>
                            <Input
                              backgroundColor="blue"
                              label="Kennitala málsaðila"
                              name="Test1"
                            />
                          </GridColumn>
                          <GridColumn span="6/12" paddingTop={5}>
                            <Input
                              backgroundColor="blue"
                              label="Málsnúmer"
                              name="Test1"
                            />
                          </GridColumn>
                        </GridRow>
                        <GridRow>
                          <GridColumn span="12/12" paddingTop={5}>
                            <Input
                              textarea
                              backgroundColor="blue"
                              rows={10}
                              label="Erindi"
                              name="Test1"
                            />
                          </GridColumn>
                        </GridRow>
                      </>
                    )}
                  </GridColumn>
                </GridRow>
                <GridRow marginTop={7}>
                  <GridColumn
                    span={['12/12', '12/12', '12/12', '3/12']}
                    offset={[null, null, null, '6/12']}
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="flexEnd"
                      alignItems="flexEnd"
                    >
                      <Button
                        disabled
                        colorScheme="default"
                        iconType="filled"
                        preTextIconType="filled"
                        size="default"
                        type="button"
                        variant="primary"
                      >
                        Senda fyrirspurn
                      </Button>
                    </Box>
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </>
  )
}

export default ContactForms
