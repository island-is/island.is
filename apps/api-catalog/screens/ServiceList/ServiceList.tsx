import React, { useState, useEffect } from 'react'
import {  Box,
          Stack,
          BulletList,
          Bullet,
          Button,
          Checkbox,
          GridContainer,
          GridRow,
          GridColumn,
          SidebarAccordion
} from '@island.is/island-ui/core'

import { Layout,
         ServiceCard,
         ServiceCardInformation,
         CategoryCheckBox
       } from '../../components'

import { getServices,
         GetServicesParameters,
         getAllPriceCategories,
         getAllDataCategories
       } from '../../components/ServiceRepository/service-repository'


export interface ServiceListProps {
  servicesList:Array<ServiceCardInformation>
  nextCursor: number,
  prevCursor: number,
  parameters: GetServicesParameters
}


export default function ServiceList(props:ServiceListProps) {

  if (!props.parameters === null) {
    props.parameters = { cursor:0, limit:null, owner:null, name:null, pricing:null, data:null };
  }
  function bullets() {
    return (
    <BulletList type='ul'>
      <Bullet>
        Þjónusta að virka eins og búist er við
      </Bullet>
      <Bullet>
        Þjónusta svarar með töfum
      </Bullet>
      <Bullet>
        Þjónusta er óaðgengileg
      </Bullet>
      <Bullet>
        Staða þjónustu er ekki þekkt
      </Bullet>
  </BulletList>)
  }

  const makeNavigation = () => {
    return (
      <div className="navigation">
        <Button disabled={prevCursor === null} variant="text" onClick={() => onPageButtonClick(prevCursor)} leftIcon="arrowLeft">
          Fyrri
        </Button>
        <Button disabled={nextCursor === null} variant="text" onClick={() => onPageButtonClick(nextCursor)} icon="arrowRight">
          Næsta
        </Button>
      </div>
    )
  }

  const onPageButtonClick = (nextC) => {
    props.parameters.cursor = nextC;
    setParamCursor(props.parameters.cursor);
  }

  const [services,    setServices]   = useState<Array<ServiceCardInformation>>(props.servicesList);
  const [pricing,     setPricing]    = useState<Array<string>>(props.parameters.pricing);
  const [data,        setData]       = useState<Array<string>>(props.parameters.data);
  const [type,        setType]       = useState<Array<string>>(props.parameters.type);
  const [access,      setAccess]       = useState<Array<string>>(props.parameters.access);
  const [prevCursor,  setPrevCursor] = useState<number>(props.prevCursor);
  const [nextCursor,  setNextCursor] = useState<number>(props.nextCursor);
  const [paramCursor, setParamCursor]= useState<number>(null);
  //pricing
  const [checkPricingFree,   setCheckPricingFree]   = useState<boolean>(true);
  const [checkPricingUsage,  setCheckPricingUsage]  = useState<boolean>(true);
  const [checkPricingDaily,  setCheckPricingDaily]  = useState<boolean>(true);
  const [checkPricingMonthly,setCheckPricingMonthly]= useState<boolean>(true);
  const [checkPricingYearly, setCheckPricingYearly] = useState<boolean>(true);
  const [checkPricingCustom, setCheckPricingCustom] = useState<boolean>(true);
  //data
  const [checkDataPublic,      setCheckDataPublic]  = useState<boolean>(true);
  const [checkDataOfficial,  setCheckDataOfficial]  = useState<boolean>(true);
  const [checkDataPersonal,  setCheckDataPersonal]  = useState<boolean>(true);
  const [checkDataHealth,    setCheckDataHealth]    = useState<boolean>(true);
  const [checkDataFinancial, setCheckDataFinancial] = useState<boolean>(true);
  //type
  const [checkTypeReact,      setCheckTypeReact]  = useState<boolean>(true);
  const [checkTypeSoap,       setCheckTypeSoap]  = useState<boolean>(true);
  const [checkTypeGraphQl,    setCheckTypeGraphQl]  = useState<boolean>(true);
  //access
  const [checkAccessApiXRoad, setCheckAccessXRoad]  = useState<boolean>(true);
  const [checkAccessApiGw,    setCheckAccessApiGw]  = useState<boolean>(true);


  useEffect(() => {
    const loadData = async () => {
      const response = await getServices(props.parameters);
      setServices(response.result);
      setPrevCursor(response.prevCursor);
      setNextCursor(response.nextCursor);
    }
      loadData();
  }, [checkDataPersonal,checkPricingFree, paramCursor, props.parameters]);

  const updateCategoryCheckBox = event => {

    props.parameters.cursor = null;
    if (props.parameters.pricing === null) {
      props.parameters.pricing = [];
    }

    let filter:Array<string>;
    switch(event.target.value){
      case 'free'    : filter = props.parameters.pricing; break;
      case 'personal': filter = props.parameters.data; break;
      default:
        console.error('Invalid checkbox value')
        return;
    }

    if (filter === null) {
      filter = [];
    }
    if (event.target.checked) {
        if (!filter.includes(event.target.value)) {
          filter.push(event.target.value)
        }
    } else {
      filter.splice(filter.indexOf(event.target.value), 1);
    }


    switch(event.target.value){
      case 'free'    : setCheckPricingFree(event.target.checked); break;
      case 'personal': setCheckDataPersonal(event.target.checked); break;
    }

    setParamCursor(props.parameters.cursor);
  }
  return (
      <Layout left={
        <Box className="service-list">
          {bullets()}
          <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
            <GridContainer>
              <GridRow className="service-items">
                <GridColumn span={9}>
                  {makeNavigation()}
                  <Stack space={3}>
                    {
                      services?.map( (item, index) => {
                        return <ServiceCard key={index} service={item} />
                      })
                    }
                  </Stack>
                    {makeNavigation()}
                </GridColumn>
                <GridColumn  span="3/12" className="filter">
                <SidebarAccordion  id="pricing_category" label="Verð">
                  <CategoryCheckBox label={PRICING_CATEGORY.FREE}    value={PRICING_CATEGORY.FREE}    checked={props.parameters.pricing.includes(PRICING_CATEGORY.FREE)}    onChange={({target})=>{updateCategoryCheckBox(target)}} />
                  <CategoryCheckBox label={PRICING_CATEGORY.USAGE}   value={PRICING_CATEGORY.USAGE}   checked={props.parameters.pricing.includes(PRICING_CATEGORY.USAGE)}   onChange={({target})=>{updateCategoryCheckBox(target)}} />
                  <CategoryCheckBox label={PRICING_CATEGORY.DAILY}   value={PRICING_CATEGORY.DAILY}   checked={props.parameters.pricing.includes(PRICING_CATEGORY.DAILY)}   onChange={({target})=>{updateCategoryCheckBox(target)}} />
                  <CategoryCheckBox label={PRICING_CATEGORY.MONTHLY} value={PRICING_CATEGORY.MONTHLY} checked={props.parameters.pricing.includes(PRICING_CATEGORY.MONTHLY)} onChange={({target})=>{updateCategoryCheckBox(target)}} />
                  <CategoryCheckBox label={PRICING_CATEGORY.YEARLY}  value={PRICING_CATEGORY.YEARLY}  checked={props.parameters.pricing.includes(PRICING_CATEGORY.YEARLY)}  onChange={({target})=>{updateCategoryCheckBox(target)}} />
                  <CategoryCheckBox label={PRICING_CATEGORY.CUSTOM}  value={PRICING_CATEGORY.CUSTOM}  checked={props.parameters.pricing.includes(PRICING_CATEGORY.CUSTOM)}  onChange={({target})=>{updateCategoryCheckBox(target)}} />
                </SidebarAccordion>

                <SidebarAccordion id="data_category" label="Gögn">
                  <CategoryCheckBox label={DATA_CATEGORY.PUBLIC}    value={DATA_CATEGORY.PUBLIC}    checked={props.parameters.data.includes(DATA_CATEGORY.PUBLIC)}    onChange={({target})=>{updateCategoryCheckBox(target)}} />
                  <CategoryCheckBox label={DATA_CATEGORY.OFFICIAL}  value={DATA_CATEGORY.OFFICIAL}  checked={props.parameters.data.includes(DATA_CATEGORY.OFFICIAL)}  onChange={({target})=>{updateCategoryCheckBox(target)}} />
                  <CategoryCheckBox label={DATA_CATEGORY.PERSONAL}  value={DATA_CATEGORY.PERSONAL}  checked={props.parameters.data.includes(DATA_CATEGORY.PERSONAL)}  onChange={({target})=>{updateCategoryCheckBox(target)}} />
                  <CategoryCheckBox label={DATA_CATEGORY.HEALTH}    value={DATA_CATEGORY.HEALTH}    checked={props.parameters.data.includes(DATA_CATEGORY.HEALTH)}    onChange={({target})=>{updateCategoryCheckBox(target)}} />
                  <CategoryCheckBox label={DATA_CATEGORY.FINANCIAL} value={DATA_CATEGORY.FINANCIAL} checked={props.parameters.data.includes(DATA_CATEGORY.FINANCIAL)} onChange={({target})=>{updateCategoryCheckBox(target)}} />
                </SidebarAccordion>

                <SidebarAccordion id="type_category" label="Gerð">
                  <CategoryCheckBox label={TYPE_CATEGORY.REACT}   value={TYPE_CATEGORY.REACT}   checked={props.parameters.type.includes(TYPE_CATEGORY.REACT)}   onChange={({target})=>{updateCategoryCheckBox(target)}} />
                  <CategoryCheckBox label={TYPE_CATEGORY.SOAP}    value={TYPE_CATEGORY.SOAP}    checked={props.parameters.type.includes(TYPE_CATEGORY.SOAP)}    onChange={({target})=>{updateCategoryCheckBox(target)}} />
                  <CategoryCheckBox label={TYPE_CATEGORY.GRAPHQL} value={TYPE_CATEGORY.GRAPHQL} checked={props.parameters.type.includes(TYPE_CATEGORY.GRAPHQL)} onChange={({target})=>{updateCategoryCheckBox(target)}} />
                </SidebarAccordion>

                <SidebarAccordion id="access_category" label="Aðgangur">
                  <CategoryCheckBox label={ACCESS_CATEGORY.X_ROAD} value={ACCESS_CATEGORY.X_ROAD}  checked={props.parameters.access.includes(ACCESS_CATEGORY.X_ROAD)} onChange={({target})=>{updateCategoryCheckBox(target)}} />
                  <CategoryCheckBox label={ACCESS_CATEGORY.API_GW} value={ACCESS_CATEGORY.API_GW}  checked={props.parameters.access.includes(ACCESS_CATEGORY.API_GW)} onChange={({target})=>{updateCategoryCheckBox(target)}} />
                </SidebarAccordion>
                <SidebarAccordion id="filter_settings" label="Stillingar">

                <CategoryCheckBox label="Velja"   value="select-all" checked={checkSettingsCheckAll}     onChange={onCheckSettingsCheckAllClick}
                    tooltip="Haka í eða úr öllum gildum í öllum flokkum."/>
          <div>
            <div>Leitaraðferð</div>
          <RadioButton name="RadioButtonSearchMethod" id="SearchMethod1" label="Einn" value="1"
            tooltip="Eitt gildi í einum flokk þarf að passa"
            onChange={({ target }) => {
            setRadioSearchMethod(target.value)
            props.parameters.searchMethod = target.value === '1'? SERVICE_SEARCH_METHOD.MUST_CONTAIN_ONE_OF_CATEGORY : SERVICE_SEARCH_METHOD.MUST_CONTAIN_ONE_OF_EACH_CATEGORY;
            setCheckSettingsSearchMethod(props.parameters.searchMethod)
          }}
          checked={radioSearchMethod === '1'}
        />
        <RadioButton name="RadioButtonSearchMethod" id="SearchMethod2" label="Allir" value="2"
          tooltip="Eitt gildi í hverjum flokk þarf að passa"
          onChange={({ target }) => {
            setRadioSearchMethod(target.value)
            props.parameters.searchMethod = target.value === '2'? SERVICE_SEARCH_METHOD.MUST_CONTAIN_ONE_OF_EACH_CATEGORY : SERVICE_SEARCH_METHOD.MUST_CONTAIN_ONE_OF_CATEGORY;
            setCheckSettingsSearchMethod(props.parameters.searchMethod)
          }}
          checked={radioSearchMethod === '2'}
        />
        </div>


                  </SidebarAccordion>
                </GridColumn>
              </GridRow>
            </GridContainer>
          </Box>
        </Box>
      } />
  )
}
ServiceList.getInitialProps = async ():Promise<ServiceListProps> => {

  const params:GetServicesParameters = { cursor:null,
    limit:null,
    owner:null,
    name:null,
    pricing:getAllPriceCategories(),
    data:getAllDataCategories(),
    type:getAllTypeCategories(),
    access:getAllAccessCategories()
  };
  //params.pricing = params.pricing.filter(e => e !== PRICING_CATEGORY.FREE)
  console.log(JSON.parse(JSON.stringify(params)))
return { parameters:params, prevCursor:null, nextCursor:null, servicesList: null };
}
