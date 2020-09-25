import React, { useState, useEffect, ReactNode, useLayoutEffect } from 'react';
import {  Box,  
          Button, 
          ContentBlock, 
          GridRow, 
          GridColumn,
          Icon,
          Typography, AccordionItem, AsyncSearch
} from '@island.is/island-ui/core';

import * as styles from './ServiceList.treat';
import cn from 'classnames'
import {  PRICING_CATEGORY, 
          DATA_CATEGORY, 
          TYPE_CATEGORY,
          ACCESS_CATEGORY, 
          GetServicesParameters, 
          getServices, 
          ServiceCardInformation, 
          ServiceCard, 
          CategoryCheckBox
} from '../../components';

import ContentfulApi from '../../services/contentful'
import { StaticPage } from '../../services/contentful.types'
import { ClassValue } from 'classnames/types';

interface PropTypes {
  top?: ReactNode
  left: ReactNode
  right?: ReactNode
  bottom?: ReactNode
  classes?: string
}

function ServiceLayout({ top, bottom, left, right, classes}: PropTypes) {
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
                    offset={[    '0',  '0',     '0',    '0', '0']}>
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



function useWindowEvents() {
  const [size, setSize] = useState([0, 0, 0]);
  useLayoutEffect(() => {
    function updateValues() {
      setSize([window.innerWidth, window.innerHeight, Math.round(window.scrollY)]);
    }

    window.addEventListener('resize', updateValues);
    window.addEventListener('scroll', updateValues);
    updateValues();
    return () => {
      window.removeEventListener('resize', updateValues);
      window.removeEventListener('scroll', updateValues);
    }
  }, []);
  return size;
}

export interface ServiceListProps {
  nextCursor: string
  prevCursor: string
  parameters: GetServicesParameters,
  pageContent: StaticPage
}


export default function ServiceList(props:ServiceListProps) {
  
  if (!props.parameters === null) {
    props.parameters = { 
      cursor:null, 
      limit:null, 
      owner:null, 
      name:null, 
      pricing:[], 
      data:[], 
      type:[], 
      access:[],
      text:null};
  }
 
  const onPageMoreButtonClick = () => {
    props.parameters.cursor = nextCursor;
    setFirstGet(false);
    setNextFetch(nextCursor);
  }

  const updateCategoryCheckBox = (target) => {
    const categoryValue:string = target.value;
    const checked:boolean = target.checked;
    props.parameters.cursor = null;
    let filter:Array<string>;
    switch(categoryValue){
      case PRICING_CATEGORY.FREE:
      case PRICING_CATEGORY.PAID:   filter = props.parameters.pricing; 
                                    break;
      case DATA_CATEGORY.PUBLIC:
      case DATA_CATEGORY.OFFICIAL:
      case DATA_CATEGORY.PERSONAL:     
      case DATA_CATEGORY.HEALTH:
      case DATA_CATEGORY.FINANCIAL: filter = props.parameters.data; 
                                    break;
      case TYPE_CATEGORY.REACT:
      case TYPE_CATEGORY.SOAP:           
      case TYPE_CATEGORY.GRAPHQL:   filter = props.parameters.type; 
                                    break;
      case ACCESS_CATEGORY.X_ROAD:
      case ACCESS_CATEGORY.API_GW:  filter = props.parameters.access; 
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

  const createStatusQueryString = ():string => {
    let str:string = props.parameters.cursor ===null? 'null':props.parameters.cursor.toString();
    str+=`|${props.parameters.text}`
    str+= `|${props.parameters.pricing.sort().join()}|${props.parameters.data.sort().join()}|${props.parameters.type.sort().join()}|${props.parameters.access.sort().join()}`;
    return str;  
  }

  const isMobile = (width:number) => {
    return width < 771;
  }

  const [isLoading,    setLoading]   = useState<boolean>(true);
  const [services,    setServices]   = useState<Array<ServiceCardInformation>>(null);
  const [nextCursor,  setNextCursor] = useState<string>(props.nextCursor);
  const [nextFetch,   setNextFetch] = useState<string>(null);
  const [firstGet,    setFirstGet] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState('');
  const [StatusQueryString, setStatusQueryString]= useState<string>(createStatusQueryString());
  const [width] = useWindowEvents();
  
  const onSearchChange = function(inputValue: string){
    props.parameters.text = inputValue;
    setSearchValue(inputValue);
    setStatusQueryString(createStatusQueryString());
    setFirstGet(true);
  }

  useEffect(() => {
    
    const appendData = async () => {
      setLoading(true);
      const response = await getServices(props.parameters);
      services.push(...response.result);    
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
        setFirstGet(true);
        props.parameters.cursor=null;
        const response = await getServices(props.parameters);
        setNextCursor(response.nextCursor);
        setServices(response.result);
        setLoading(false);
      }
      if (firstGet)
        loadData();
    }, [firstGet, StatusQueryString, props.parameters]);

  return (   
      <ServiceLayout  classes={cn(isMobile(width)? styles.serviceLayoutMobile : {})}
      top={
            <div className={cn(styles.topSection)}>
              <Typography variant="h1">{props.pageContent.title}</Typography>
              <div className={cn(styles.topSectionText)}>
                <Typography variant="intro">{props.pageContent.introText}</Typography>
              </div>
            </div>
      }
      left={
          <Box className={cn(styles.serviceList, "service-list")} marginBottom="containerGutter" marginTop={1}>
                    {
                      services?.map( (item) => {
                        return <ServiceCard key={item.id} service={item} />
                      })
                    }
          </Box>
      }
      right={
              <Box  className={cn(isMobile(width)? styles.filterMobile : styles.filter , "filter")}>
                <Box className={cn(styles.inputSearch)}>
                  <AsyncSearch 
                    options={[]}
                    size='medium'
                    placeholder="Leita"
                    inputValue ={searchValue}
                    onInputValueChange={(inputValue) => onSearchChange(inputValue)}
                    loading={isLoading}
                    colored={searchValue.length < 1}
                  />
              </Box>
              <div className={cn(styles.filterItem)}>
                <AccordionItem  id="pricing_category" label="Pricing" labelVariant="sideMenu" iconVariant="default">
                  <CategoryCheckBox label={PRICING_CATEGORY.FREE}   value={PRICING_CATEGORY.FREE}   checked={props.parameters.pricing.includes(PRICING_CATEGORY.FREE)}   onChange={({target})=>{updateCategoryCheckBox(target)}} />
                  <CategoryCheckBox label={PRICING_CATEGORY.PAID}   value={PRICING_CATEGORY.PAID}   checked={props.parameters.pricing.includes(PRICING_CATEGORY.PAID)}   onChange={({target})=>{updateCategoryCheckBox(target)}} />
                </AccordionItem>
              </div>
              <div className={cn(styles.filterItem)}>
              <AccordionItem  id="data_category" label="Data" labelVariant="sideMenu" iconVariant="default">
                  <CategoryCheckBox label={DATA_CATEGORY.PUBLIC}    value={DATA_CATEGORY.PUBLIC}    checked={props.parameters.data.includes(DATA_CATEGORY.PUBLIC)}    onChange={({target})=>{updateCategoryCheckBox(target)}} />
                  <CategoryCheckBox label={DATA_CATEGORY.OFFICIAL}  value={DATA_CATEGORY.OFFICIAL}  checked={props.parameters.data.includes(DATA_CATEGORY.OFFICIAL)}  onChange={({target})=>{updateCategoryCheckBox(target)}} />
                  <CategoryCheckBox label={DATA_CATEGORY.PERSONAL}  value={DATA_CATEGORY.PERSONAL}  checked={props.parameters.data.includes(DATA_CATEGORY.PERSONAL)}  onChange={({target})=>{updateCategoryCheckBox(target)}} />
                  <CategoryCheckBox label={DATA_CATEGORY.HEALTH}    value={DATA_CATEGORY.HEALTH}    checked={props.parameters.data.includes(DATA_CATEGORY.HEALTH)}    onChange={({target})=>{updateCategoryCheckBox(target)}} />
                  <CategoryCheckBox label={DATA_CATEGORY.FINANCIAL} value={DATA_CATEGORY.FINANCIAL} checked={props.parameters.data.includes(DATA_CATEGORY.FINANCIAL)} onChange={({target})=>{updateCategoryCheckBox(target)}} />
                </AccordionItem>
              </div>
              <div className={cn(styles.filterItem)}>
                <AccordionItem  id="type_category" label="Type" labelVariant="sideMenu" iconVariant="default">
                  <CategoryCheckBox label={TYPE_CATEGORY.REACT}   value={TYPE_CATEGORY.REACT}   checked={props.parameters.type.includes(TYPE_CATEGORY.REACT)}   onChange={({target})=>{updateCategoryCheckBox(target)}} />
                  <CategoryCheckBox label={TYPE_CATEGORY.SOAP}    value={TYPE_CATEGORY.SOAP}    checked={props.parameters.type.includes(TYPE_CATEGORY.SOAP)}    onChange={({target})=>{updateCategoryCheckBox(target)}} />
                  <CategoryCheckBox label={TYPE_CATEGORY.GRAPHQL} value={TYPE_CATEGORY.GRAPHQL} checked={props.parameters.type.includes(TYPE_CATEGORY.GRAPHQL)} onChange={({target})=>{updateCategoryCheckBox(target)}} />
                </AccordionItem>
              </div>
              <div className={cn(styles.filterItem)}>
                <AccordionItem  id="access_category" label="Access" labelVariant="sideMenu" iconVariant="default">
                  <CategoryCheckBox label={ACCESS_CATEGORY.X_ROAD} value={ACCESS_CATEGORY.X_ROAD}  checked={props.parameters.access.includes(ACCESS_CATEGORY.X_ROAD)} onChange={({target})=>{updateCategoryCheckBox(target)}} />
                  <CategoryCheckBox label={ACCESS_CATEGORY.API_GW} value={ACCESS_CATEGORY.API_GW}  checked={props.parameters.access.includes(ACCESS_CATEGORY.API_GW)} onChange={({target})=>{updateCategoryCheckBox(target)}} />
                </AccordionItem>
              </div>
          </Box>
      } 
      
      bottom = {
        <Box className={cn(isMobile(width)? styles.navigationMobile : styles.navigation)} borderRadius="large">
          <div className={cn(isLoading? styles.displayInline: styles.displayHidden)}>
            <Icon width="32" height="32" spin={true} type='loading' color="blue600" />
          </div>
          <div className={cn(isLoading? styles.displayHidden : {})}>
            <Button disabled={nextCursor === null} variant="text" onClick={() => onPageMoreButtonClick()} icon="cheveron" >
              {props.pageContent.buttons.find(b => b.id === 'services-fetch-more').label}
            </Button>
          </div>
        </Box>
      }
      />
  )
}

ServiceList.getInitialProps = async ():Promise<ServiceListProps> => {

  const client = new ContentfulApi();

  const pageContent = await client.fetchStaticPageBySlug('services', 'is-IS');

  const params:GetServicesParameters = { 
    cursor:null, 
    limit:null, 
    owner:null,
    name:null, 
    pricing:[], 
    data:[],
    type:[],    
    access:[],
    text:''
  };
return { 
  parameters:params, 
  prevCursor:null, 
  nextCursor:null, 
  pageContent:pageContent
};
}