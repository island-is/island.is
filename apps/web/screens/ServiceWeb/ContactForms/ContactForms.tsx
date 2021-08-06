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

import { supportForms } from '../mock'

import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import GhostForm from './GhostForm'
import { ServiceWebHeader } from '@island.is/web/components'
import * as sharedStyles from '../shared/styles.treat'

const ContactForms = () => {
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
                        setSelectedForm(
                          supportForms.find((sf) => sf.ref === formValue.value),
                        )
                      }}
                      options={supportForms.map((sf) => {
                        return {
                          label: sf.ref,
                          value: sf.ref,
                        }
                      })}
                      placeholder="Veldu flokk"
                      size="md"
                    />
                    {!selectedForm && <GhostForm />}
                    {selectedForm &&
                      selectedForm.inputs?.map((input, key) => {
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

export default ContactForms
