
import React from 'react'
import { render } from '@testing-library/react'

import ServiceList from './ServiceList'
import { ServiceCardInformation, SERVICE_STATUS } from '../../components';
import {  getAllPriceCategories, 
          GetServicesParameters, 
          SERVICE_SEARCH_METHOD, 
          PRICING_CATEGORY, DATA_CATEGORY, ACCESS_CATEGORY, TYPE_CATEGORY 
        } from '../../components/ServiceRepository/service-repository';

describe(' ServiceList ', () => {
  const services:Array<ServiceCardInformation> = [
    { id:0, 
      name:"service zero Name",   
      owner:"Owner of service 0", 
      url:"", 
      pricing:[PRICING_CATEGORY.FREE, PRICING_CATEGORY.CUSTOM],            
      data:[DATA_CATEGORY.PERSONAL],           
      type:null,
      access:[ACCESS_CATEGORY.X_ROAD],
      status:SERVICE_STATUS.ERROR
    },
    { id:1,
      name:"service one name",
      owner:"Owner of service 1", 
      url:"", 
      pricing:null,
      data:[DATA_CATEGORY.PERSONAL, DATA_CATEGORY.PUBLIC],
      type:[TYPE_CATEGORY.REACT], 
      access:[ACCESS_CATEGORY.API_GW], 
      status:SERVICE_STATUS.OK
    },
    { id:2, 
      name:"service two Name", 
      owner:"Owner of service 2", 
      url:"", 
      pricing:[PRICING_CATEGORY.DAILY,PRICING_CATEGORY.MONTHLY, PRICING_CATEGORY.YEARLY], 
      data:[DATA_CATEGORY.PERSONAL, DATA_CATEGORY.PUBLIC], 
      type:[TYPE_CATEGORY.SOAP],  
      access:[ACCESS_CATEGORY.API_GW], 
      status:SERVICE_STATUS.OK
    },
    { id:3, 
      name:"Þjóðskrá",           
      owner:"Fasteignaskrá",      
      url:"", 
      pricing:null,                          
      data:[DATA_CATEGORY.PERSONAL],           
      type:[TYPE_CATEGORY.REACT],  
      access:[ACCESS_CATEGORY.API_GW], 
      status:SERVICE_STATUS.OK
    }
  ];

  const params:GetServicesParameters = { 
    cursor:null, 
    limit:null, 
    owner:null, 
    name:null, 
    pricing:getAllPriceCategories(), 
    data:[],
    access:[],
    type:[],
    searchMethod:SERVICE_SEARCH_METHOD.MUST_CONTAIN_ONE_OF_CATEGORY
  };
  
  it('should render successfully', () => {
    const { baseElement } = render(<ServiceList parameters={params} prevCursor={null} nextCursor={0} servicesList={services}/>);
    expect(baseElement).toBeTruthy();
  })
  it('Service names should all be visible', () => {
    const { getByText } = render(<ServiceList parameters={params}  prevCursor={null} nextCursor={0} servicesList={services}/>);
    expect(getByText(services[0].name)).toBeTruthy();
    expect(getByText(services[1].name)).toBeTruthy();
    expect(getByText(services[2].name)).toBeTruthy();
    expect(getByText(services[3].name)).toBeTruthy();
  })

  it('Service owners should all be visible', () => {
    const { getByText } = render(<ServiceList parameters={params}  prevCursor={null} nextCursor={0} servicesList={services}/>);
    expect(getByText(services[0].owner)).toBeTruthy();
    expect(getByText(services[1].owner)).toBeTruthy();
    expect(getByText(services[2].owner)).toBeTruthy();
    expect(getByText(services[3].owner)).toBeTruthy();
  })
})
