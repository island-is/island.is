import React from 'react'
import { render } from '@testing-library/react'

import ServiceList from './ServiceList'

describe(' ServiceList ', () => {
  const services = [
    { name:"service one Name",   owner:"Owner of service 1", pricing:["free", "custom"],            categories:null,                   type:null,      access:["X-Road"]},
    { name:"service two Name",   owner:"Owner of service 2", pricing:null,                          categories:["personal", "public"], type:["react"], access:["API GW"]},
    { name:"service three Name", owner:"Owner of service 3", pricing:["daily","monthly", "yearly"], categories:["personal", "public"], type:["SOAP"],  access:["API GW"]},
    { name:"Þjóðskrá",           owner:"Fasteignaskrá",      pricing:null,                          categories:null,                   type:["REST"],  access:["API GW"]},
  ];
  
  it('should render successfully', () => {
    const { baseElement } = render(<ServiceList nextCursor={0} servicesList={services}/>);
    expect(baseElement).toBeTruthy();
  })
  it('Service names should all be visible', () => {
    const { getByText } = render(<ServiceList nextCursor={0} servicesList={services}/>);
    expect(getByText(services[0].name)).toBeTruthy();
    expect(getByText(services[1].name)).toBeTruthy();
    expect(getByText(services[2].name)).toBeTruthy();
    expect(getByText(services[3].name)).toBeTruthy();
  })

  it('Service owners should all be visible', () => {
    const { getByText } = render(<ServiceList nextCursor={0} servicesList={services}/>);
    expect(getByText(services[0].owner)).toBeTruthy();
    expect(getByText(services[1].owner)).toBeTruthy();
    expect(getByText(services[2].owner)).toBeTruthy();
    expect(getByText(services[3].owner)).toBeTruthy();
  })
})
