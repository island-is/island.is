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
  InputFileUpload,
} from '@island.is/island-ui/core'

import { Screen } from '../../../types'

import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import GhostForm from './GhostForm'
import { ServiceWebHeader } from '@island.is/web/components'
import * as sharedStyles from '../shared/styles.treat'
import { Organization, Query } from '@island.is/api/schema'
import {
  ContentLanguage,
  QueryGetNamespaceArgs,
  QueryGetOrganizationArgs,
  QueryGetSupportFormInOrganizationArgs,
} from '@island.is/web/graphql/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_SUPPORT_FORM_IN_ORGANIZATION,
  GET_ORGANIZATION_QUERY,
} from '../../queries'
import { withMainLayout } from '@island.is/web/layouts/main'

interface ContactFormsProps {
  organization?: Organization
  namespace: Query['getNamespace']
  supportForms: Query['getSupportFormInOrganization']
}

const ContactForms: Screen<ContactFormsProps> = ({ supportForms }) => {
  const logoTitle = 'Þjónustuvefur Sýslumanna'
  const { linkResolver } = useLinkResolver()
  const [selectedForm, setSelectedForm] = useState(undefined)

  return (
    <>
      <ServiceWebHeader logoTitle={logoTitle} />
      <div className={cn(sharedStyles.bg, sharedStyles.bgSmall)} />
      <Box marginY={[3, 3, 10]} marginBottom={10}>
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
                  <GridColumn span={['12/12', '12/12', '12/12', '8/12']}>
                    <Select
                      backgroundColor="blue"
                      icon="chevronDown"
                      isSearchable
                      label="Málaflokkur"
                      name="supportForm"
                      noOptionsMessage="Enginn valmöguleiki"
                      value={selectedForm?.value}
                      onChange={(form) => {
                        const formValue: any = form
                        console.log('FOUND')
                        setSelectedForm(
                          JSON.parse(
                            supportForms.find(
                              (sf) => sf.category === formValue.value,
                            ).form,
                          ),
                        )
                      }}
                      options={supportForms.map((sf) => {
                        return {
                          label: sf.category,
                          value: sf.category,
                        }
                      })}
                      placeholder="Veldu flokk"
                      size="md"
                    />
                    {!selectedForm && <GhostForm />}
                    {selectedForm &&
                      selectedForm.formItems.map((input, key) => {
                        return (
                          <GridRow key={key}>
                            {input.type === 'dual' ? (
                              input.items?.map((input) => {
                                return (
                                  input.title && (
                                    <GridColumn
                                      key={input.title}
                                      span="6/12"
                                      paddingTop={5}
                                    >
                                      <Input
                                        backgroundColor="blue"
                                        required={input.required}
                                        label={input.title}
                                        name={input.title}
                                      />
                                    </GridColumn>
                                  )
                                )
                              })
                            ) : input.type === 'file' ? (
                              <GridColumn span="12/12" paddingTop={5}>
                                <InputFileUpload
                                  fileList={[]}
                                  accept=".pdf"
                                  header={input.header}
                                  description={input.description}
                                  buttonLabel={input.buttonText}
                                  onChange={(_) => _}
                                  onRemove={(_) => _}
                                />
                              </GridColumn>
                            ) : (
                              <GridColumn span="12/12" paddingTop={5}>
                                <Input
                                  type={input.type}
                                  required={input.required}
                                  label={input.title}
                                  name={input.title}
                                  backgroundColor="blue"
                                  rows={input.type === 'textarea' ? 10 : 1}
                                  textarea={input.type === 'textarea'}
                                />
                              </GridColumn>
                            )}
                          </GridRow>
                        )
                      })}
                  </GridColumn>
                </GridRow>
                <GridRow marginTop={7}>
                  <GridColumn span={['12/12', '12/12', '12/12', '8/12']}>
                    <GridRow>
                      <GridColumn span={['12/12', '12/12', '6/12', '6/12']}>
                        <Select
                          backgroundColor="blue"
                          icon="chevronDown"
                          isSearchable
                          label="Þinn sýslumaður"
                          name="supportForm"
                          noOptionsMessage="TODO: where be sýslumenn?"
                          onChange={(_) => _}
                          options={[]}
                          placeholder="Veldu sýslumannsembætti"
                          size="sm"
                        />
                      </GridColumn>
                      <GridColumn span={['12/12', '12/12', '6/12', '6/12']}>
                        <Box
                          marginTop={[6, 6, 0, 0]}
                          display="flex"
                          flexDirection="column"
                          justifyContent="flexEnd"
                          alignItems="flexEnd"
                        >
                          <Button disabled>Senda fyrirspurn</Button>
                        </Box>
                      </GridColumn>
                    </GridRow>
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

ContactForms.getInitialProps = async ({ apolloClient, locale, query }) => {
  const slug = query.slug ? (query.slug as string) : 'stafraent-island'

  console.log(slug)

  const [organization, namespace, supportForms] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationArgs>({
      query: GET_ORGANIZATION_QUERY,
      variables: {
        input: {
          slug,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Global',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables.data.getNamespace.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
    apolloClient.query<Query, QueryGetSupportFormInOrganizationArgs>({
      query: GET_SUPPORT_FORM_IN_ORGANIZATION,
      variables: {
        input: {
          slug,
          lang: locale as ContentLanguage,
        },
      },
    }),
  ])
  console.log('PROPS')
  console.log({
    organization: organization?.data?.getOrganization,
    namespace,
    supportForms: supportForms?.data?.getSupportFormInOrganization,
  })

  return {
    organization: organization?.data?.getOrganization,
    namespace,
    supportForms: supportForms?.data?.getSupportFormInOrganization,
  }
}

export default withMainLayout(ContactForms, {
  showHeader: false,
})
