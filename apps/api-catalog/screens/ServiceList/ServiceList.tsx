import React, { useState, useEffect } from 'react'
import {  Box,  
          Stack,  
          Button, 
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
         PRICING_CATEGORY, DATA_CATEGORY, getAllPriceCategories, getAllDataCategories, TYPE_CATEGORY, ACCESS_CATEGORY, getAllAccessCategories, getAllTypeCategories 
       } from '../../components/ServiceRepository/service-repository'


export interface ServiceListProps {
  servicesList:Array<ServiceCardInformation>
  nextCursor: number
  prevCursor: number
  parameters: GetServicesParameters
}


export default function ServiceList(props:ServiceListProps) {
  
  if (!props.parameters === null) {
    props.parameters = { cursor:0, limit:null, owner:null, name:null, pricing:null, data:null, type:null, access:null };
  }
 
  const showNavigation = () => {
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
  }, [checkPricingFree, 
      checkPricingUsage,
      checkPricingDaily,
      checkPricingMonthly,
      checkPricingYearly,
      checkPricingCustom,
      checkDataPublic,    
      checkDataOfficial,
      checkDataPersonal,
      checkDataHealth,  
      checkDataFinancial,
      checkTypeReact,     
      checkTypeSoap,      
      checkTypeGraphQl,   
      checkAccessApiXRoad,
      checkAccessApiGw,   
      paramCursor, 
      pricing,
      data,
      type,
      access,
      props.parameters]);

  const updateCategoryCheckBox = event => {
    
    props.parameters.cursor = null;
    let filter:Array<string>;
    switch(event.target.value){
      case PRICING_CATEGORY.FREE:
      case PRICING_CATEGORY.USAGE:
      case PRICING_CATEGORY.DAILY:
      case PRICING_CATEGORY.MONTHLY:
      case PRICING_CATEGORY.YEARLY: 
      case PRICING_CATEGORY.CUSTOM: filter = props.parameters.pricing; 
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
    if (event.target.checked) {
        if (!filter.includes(event.target.value)) {
          filter.push(event.target.value)
        }
    } else {
      filter.splice(filter.indexOf(event.target.value), 1);
    }

    
    switch(event.target.value){
      case PRICING_CATEGORY.FREE    : setCheckPricingFree(event.target.checked);   break;
      case PRICING_CATEGORY.USAGE   : setCheckPricingUsage(event.target.checked);  break;
      case PRICING_CATEGORY.DAILY   : setCheckPricingDaily(event.target.checked);  break;
      case PRICING_CATEGORY.MONTHLY : setCheckPricingMonthly(event.target.checked);break;
      case PRICING_CATEGORY.YEARLY  : setCheckPricingYearly(event.target.checked); break;
      case PRICING_CATEGORY.CUSTOM  : setCheckPricingCustom(event.target.checked); break;

      case DATA_CATEGORY.PUBLIC     : setCheckDataPublic(event.target.checked);    break;
      case DATA_CATEGORY.OFFICIAL   : setCheckDataOfficial(event.target.checked);  break;
      case DATA_CATEGORY.PERSONAL   : setCheckDataPersonal(event.target.checked);  break;
      case DATA_CATEGORY.HEALTH     : setCheckDataHealth(event.target.checked);    break;
      case DATA_CATEGORY.FINANCIAL  : setCheckDataFinancial(event.target.checked); break;

      case TYPE_CATEGORY.REACT      : setCheckTypeReact(event.target.checked);     break;
      case TYPE_CATEGORY.SOAP       : setCheckTypeSoap(event.target.checked);      break;
      case TYPE_CATEGORY.GRAPHQL    : setCheckTypeGraphQl(event.target.checked);   break;
                                      
      case ACCESS_CATEGORY.X_ROAD   : setCheckAccessXRoad(event.target.checked);   break;
      case ACCESS_CATEGORY.API_GW   : setCheckAccessApiGw(event.target.checked);   break;

    }

    switch(event.target.value) {
      case PRICING_CATEGORY.FREE    : 
      case PRICING_CATEGORY.USAGE   : 
      case PRICING_CATEGORY.DAILY   : 
      case PRICING_CATEGORY.MONTHLY : 
      case PRICING_CATEGORY.YEARLY  : 
      case PRICING_CATEGORY.CUSTOM  : setPricing(props.parameters.pricing);
                                      break;
      case DATA_CATEGORY.PUBLIC     : 
      case DATA_CATEGORY.OFFICIAL   : 
      case DATA_CATEGORY.PERSONAL   : 
      case DATA_CATEGORY.HEALTH     : 
      case DATA_CATEGORY.FINANCIAL  : setData(props.parameters.data); 
                                      break;
      case TYPE_CATEGORY.REACT      :
      case TYPE_CATEGORY.SOAP       :           
      case TYPE_CATEGORY.GRAPHQL    : setType(props.parameters.type); 
                                      break;
      case ACCESS_CATEGORY.X_ROAD   :
      case ACCESS_CATEGORY.API_GW   : setAccess(props.parameters.access); 
                                      break;
    }

    setParamCursor(props.parameters.cursor);
  }
  return (   
      <Layout left={
        <Box className="service-list">
          <Box marginBottom="containerGutter" marginTop={1}>
            <GridContainer>
              <GridRow className="service-items">
                <GridColumn span={9}>
                  {showNavigation()}
                  <Stack space={2}>
                    {
                      services?.map( (item, index) => {
                        return <ServiceCard key={index} service={item} />
                      })
                    }
                  </Stack>
                    {showNavigation()}
                </GridColumn>
                <GridColumn  span={3} className="filter">
                <SidebarAccordion  id="pricing_category" label="Verð">
                  <CategoryCheckBox label="Frítt"       value={PRICING_CATEGORY.FREE}    checkValue={checkPricingFree}    onChange={updateCategoryCheckBox} />
                  <CategoryCheckBox label="Notkun"      value={PRICING_CATEGORY.USAGE}   checkValue={checkPricingUsage}   onChange={updateCategoryCheckBox} />
                  <CategoryCheckBox label="Daglega"     value={PRICING_CATEGORY.DAILY}   checkValue={checkPricingDaily}   onChange={updateCategoryCheckBox} />
                  <CategoryCheckBox label="Mánaðarlega" value={PRICING_CATEGORY.MONTHLY} checkValue={checkPricingMonthly} onChange={updateCategoryCheckBox} />
                  <CategoryCheckBox label="Árlega"      value={PRICING_CATEGORY.YEARLY}  checkValue={checkPricingYearly}  onChange={updateCategoryCheckBox} />
                  <CategoryCheckBox label="Breytilegt"  value={PRICING_CATEGORY.CUSTOM}  checkValue={checkPricingCustom}  onChange={updateCategoryCheckBox} />
                </SidebarAccordion>

                <SidebarAccordion id="data_category" label="Gögn">
                  <CategoryCheckBox label="Opin"       value={DATA_CATEGORY.PUBLIC}    checkValue={checkDataPublic}    onChange={updateCategoryCheckBox} />
                  <CategoryCheckBox label="Opinber"    value={DATA_CATEGORY.OFFICIAL}  checkValue={checkDataOfficial}  onChange={updateCategoryCheckBox} />
                  <CategoryCheckBox label="Persónuleg" value={DATA_CATEGORY.PERSONAL}  checkValue={checkDataPersonal}  onChange={updateCategoryCheckBox} />
                  <CategoryCheckBox label="Heilsu"     value={DATA_CATEGORY.HEALTH}    checkValue={checkDataHealth}    onChange={updateCategoryCheckBox} />
                  <CategoryCheckBox label="Fjárhags"   value={DATA_CATEGORY.FINANCIAL} checkValue={checkDataFinancial} onChange={updateCategoryCheckBox} />
                </SidebarAccordion>

                <SidebarAccordion id="type_category" label="Gerð">
                  <CategoryCheckBox label="React"      value={TYPE_CATEGORY.REACT}   checkValue={checkTypeReact}   onChange={updateCategoryCheckBox} />
                  <CategoryCheckBox label="Soap"       value={TYPE_CATEGORY.SOAP}    checkValue={checkTypeSoap}    onChange={updateCategoryCheckBox} />
                  <CategoryCheckBox label="GraphQl"    value={TYPE_CATEGORY.GRAPHQL} checkValue={checkTypeGraphQl} onChange={updateCategoryCheckBox} />
                </SidebarAccordion>

                <SidebarAccordion id="access_category" label="Aðgangur">
                  <CategoryCheckBox label="Straumurinn" value={ACCESS_CATEGORY.X_ROAD}  checkValue={checkAccessApiXRoad} onChange={updateCategoryCheckBox} />
                  <CategoryCheckBox label="Gáttin"      value={ACCESS_CATEGORY.API_GW}  checkValue={checkAccessApiGw}    onChange={updateCategoryCheckBox} />
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
  
  const response = await getServices(params);
  const result = await response.result;

  return { parameters:params, prevCursor:response.prevCursor, nextCursor:response.nextCursor, servicesList: result };
}