import React, { useState, useEffect, ReactNode } from 'react';
import { useWindowSize, useIsomorphicLayoutEffect } from 'react-use'
import {
  Box,
  Button,
  ContentBlock,
  GridRow,
  GridColumn,
  Icon,
  Typography, AccordionItem
} from '@island.is/island-ui/core';

import * as styles from './ServiceList.treat';
import cn from 'classnames'
import {
  PRICING_CATEGORY,
  DATA_CATEGORY,
  TYPE_CATEGORY,
  ACCESS_CATEGORY,
  GetServicesParameters,
  getServices,
  ServiceCardInformation,
  ServiceCard,
  ServiceFilter, 
  ServiceCardMessage
} from '../../components';

import ContentfulApi from '../../services/contentful'
import { Page } from '../../services/contentful.types'


interface PropTypes {
  top?: ReactNode
  left: ReactNode
  right?: ReactNode
  bottom?: ReactNode
  classes?: string
}

function ServiceLayout({ top, bottom, left, right, classes }: PropTypes) {
  return (
    <Box paddingX="gutter">
      {<ContentBlock >
        {top}
      </ContentBlock>}
      <ContentBlock>
        <GridRow className={classes}>
        <GridColumn span={['12/12',  '8/12',  '8/12', '9/12', '8/12']}
                  offset={[    '0',     '0',  '0',    '0', '0']}>
            {left}
          </GridColumn>
          <GridColumn span={[ '12/12',  '8/12',  '3/12', '3/12', '4/12']}
                    offset={[    '0',      '0',     '0',    '0',    '0']}>
            {right}
          </GridColumn>
        </GridRow>
      </ContentBlock>
      {<ContentBlock >
        {bottom}
      </ContentBlock>}
    </Box>
  )
}



export interface ServiceListProps {
  nextCursor: string
  prevCursor: string
  parameters: GetServicesParameters,
  pageContent: Page
}

//Todo: add to contentful
const TEXT_SEARCHING = 'Leita ...'
const TEXT_NOT_FOUND = 'Engin þjónusta fannast'


export default function ServiceList(props: ServiceListProps) {

  

  const onPageMoreButtonClick = () => {
    props.parameters.cursor = nextCursor;
    setFirstGet(false);
    setNextFetch(nextCursor);
  }

  const updateCategoryCheckBox = (target) => {
    const categoryValue: string = target.value;
    const checked: boolean = target.checked;
    props.parameters.cursor = null;
    let filter: Array<string>;
    switch (categoryValue) {
      case PRICING_CATEGORY.FREE:
      case PRICING_CATEGORY.PAID: filter = props.parameters.pricing;
        break;
      case DATA_CATEGORY.PUBLIC:
      case DATA_CATEGORY.OFFICIAL:
      case DATA_CATEGORY.PERSONAL:
      case DATA_CATEGORY.HEALTH:
      case DATA_CATEGORY.FINANCIAL: filter = props.parameters.data;
        break;
      case TYPE_CATEGORY.REACT:
      case TYPE_CATEGORY.SOAP:
      case TYPE_CATEGORY.GRAPHQL: filter = props.parameters.type;
        break;
      case ACCESS_CATEGORY.X_ROAD:
      case ACCESS_CATEGORY.API_GW: filter = props.parameters.access;
        break;

      default:
        console.error('Invalid checkbox value')
        return;
    }

    if (filter === null) {
      filter = [];
    }
    if (checked) {
      if (!filter.includes(categoryValue)) {
        filter.push(categoryValue)
      }
    } else {
      filter.splice(filter.indexOf(categoryValue), 1);
    }

    setStatusQueryString(createStatusQueryString());
    setFirstGet(true);

  }

  const createStatusQueryString = (): string => {
    let str: string = props.parameters.cursor === null ? 'null' : props.parameters.cursor.toString();
    str += `|${props.parameters.text}`
    str += `|${props.parameters.pricing.sort().join()}|${props.parameters.data.sort().join()}|${props.parameters.type.sort().join()}|${props.parameters.access.sort().join()}`;
    return str;
  }

  const onSearchChange = function (inputValue: string) {
    props.parameters.text = inputValue;
    setSearchValue(inputValue);
    if (timer !== null) {
      clearTimeout(timer);
    }
    setTimer(setTimeout(function () {
      setStatusQueryString(createStatusQueryString());
      setFirstGet(true);
    }, 600))
  }

  const [isLoading, setLoading] = useState<boolean>(true);
  const [services, setServices] = useState<Array<ServiceCardInformation>>(null);
  const [nextCursor, setNextCursor] = useState<string>(props.nextCursor);
  const [nextFetch, setNextFetch] = useState<string>(null);
  const [firstGet, setFirstGet] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState('');
  const [StatusQueryString, setStatusQueryString] = useState<string>(createStatusQueryString());
  const [timer, setTimer] = useState(null);
  const { width } = useWindowSize();
  const [emptyListText, setEmptyListText] = useState(TEXT_SEARCHING);

  const [isMobile, setIsMobile] = useState(false)

  useIsomorphicLayoutEffect(() => {
    if (width < 771) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  useEffect(() => {

    const appendData = async () => {
      setLoading(true);
      setEmptyListText(TEXT_SEARCHING)
      const response = await getServices(props.parameters);
      services.push(...response.result);
      setEmptyListText(TEXT_NOT_FOUND);
      setNextCursor(response.nextCursor);
      setLoading(false);
    }

    if (!firstGet && nextFetch) {
      appendData();
    }
  }, [firstGet, nextFetch, props.parameters, services]);

  useEffect(() => {

    const loadData = async () => {
      setLoading(true);
      setEmptyListText(TEXT_SEARCHING)
      setFirstGet(true);
      props.parameters.cursor = null;
      const response = await getServices(props.parameters);
      setEmptyListText(TEXT_NOT_FOUND);
      setNextCursor(response.nextCursor);
      setServices(response.result);
      setLoading(false);
    }
    if (firstGet)
      loadData();
  }, [firstGet, StatusQueryString, props.parameters]);

  return (
    <ServiceLayout classes={cn(isMobile ? styles.serviceLayoutMobile : {})}
      top={
        <div className={cn(styles.topSection)}>
          <Typography variant="h1">{props.pageContent.strings.find(s => s.id === 'catalog-title').text}</Typography>
          <div className={cn(styles.topSectionText)}>
            <Typography variant="intro">{props.pageContent.strings.find(s => s.id === 'catalog-intro').text}</Typography>
          </div>
        </div>
      }
      left={
        <Box className={cn(styles.serviceList, "service-list")} marginBottom="containerGutter" marginTop={1}>
          {services?.length > 0 ?
            (
              services?.map((item) => {
                return <ServiceCard key={item.id} service={item} />
              })
            )
            :
            (
              <ServiceCardMessage
                messageType="default"
                borderStyle="standard"
                title={emptyListText}
              />
            )
          }
        </Box>
      }
      right={
        isMobile? (
          <div className={cn(styles.accordionMobile)}>
            <AccordionItem id="serviceFilter" label="Sía" labelVariant="sideMenu" iconVariant="default">
              <ServiceFilter
                iconVariant="default"
                rootClasses={cn(styles.filterMobile, "filter")}
                searchValue={searchValue}
                isLoading={isLoading}
                parameters={props.parameters}
                onInputChange={input => onSearchChange(input.target.value)}
                onCheckCategoryChanged={({ target }) => { updateCategoryCheckBox(target) }}
              />
            </AccordionItem>
          </div>
        )
          :
          (
            <ServiceFilter
              rootClasses={cn(styles.filter, "filter")}
              searchValue={searchValue}
              isLoading={isLoading}
              parameters={props.parameters}
              onInputChange={input => onSearchChange(input.target.value)}
              onCheckCategoryChanged={({ target }) => { updateCategoryCheckBox(target) }}
            />
          )

      }

      bottom={
        <Box className={cn(isMobile ? styles.navigationMobile : styles.navigation)} borderRadius="large">
          <div className={cn(isLoading ? styles.displayInline : styles.displayHidden)}>
            <Icon width="32" height="32" spin={true} type='loading' color="blue600" />
          </div>
          <div className={cn(isLoading ? styles.displayHidden : {})}>
            <Button disabled={nextCursor === null} variant="text" onClick={() => onPageMoreButtonClick()} icon="cheveron" >
              {props.pageContent.strings.find(s => s.id === 'catalog-fetch-more-button').text}
            </Button>
          </div>
        </Box>
      }
    />
  )
}

ServiceList.defaultProps = {
    parameters : {
      cursor: null,
      limit: null,
      owner: null,
      name: null,
      pricing: [],
      data: [],
      type: [],
      access: [],
      text: null
  }
}

ServiceList.getInitialProps = async (ctx): Promise<ServiceListProps> => {

  const client = new ContentfulApi();
  let locale = 'is-IS';

  const pathLocale = ctx.pathname.split('/')[1];
  if (pathLocale === 'en') {
    locale = 'en-GB';
  }

  const pageContent = await client.fetchPageBySlug('services', locale);

  const params: GetServicesParameters = {
    cursor: null,
    limit: null,
    owner: null,
    name: null,
    pricing: [],
    data: [],
    type: [],
    access: [],
    text: ''
  };
  return {
    parameters: params,
    prevCursor: null,
    nextCursor: null,
    pageContent: pageContent
  }
}