import {ServiceStatusValue } from  '..'
import { ServiceCardInformation } from '../ServiceCard/service-card';
const MAX_LIMIT = 5;
const OrgServices:Array<ServiceCardInformation> =[
    { id:0, owner:"Þjóðskrá",         name:"Fasteignaskrá",       pricing:null,                          categories:null,                   type:["REST"],  access:["API GW"], url:"http://fasteignaskra.thodskra.is:4700",     status:ServiceStatusValue.OK},
    { id:1, owner:"Þjóðskrá",         name:"Einstaklingsskrá",    pricing:["free", "custom"],            categories:null,                   type:null,      access:["X-Road"], url:"http://einstaklingskra.thodskra.is:4700",   status:ServiceStatusValue.WARNING},
    { id:2, owner:"Þjóðskrá",         name:"Staðfangaskrá",       pricing:null,                          categories:["personal", "public"], type:["react"], access:["API GW"], url:"http://stadfangaskra.thodskra.is:4700",     status:ServiceStatusValue.ERROR},
    { id:3, owner:"Skatturinn",       name:"Virðisaukaskattur",   pricing:["daily","monthly", "yearly"], categories:["personal", "public"], type:["SOAP"],  access:["API GW"], url:"http://vsk.skattur.is/:2100",               status:ServiceStatusValue.WARNING},
    { id:4, owner:"Skatturinn",       name:"Staðgreiðsla",        pricing:["daily","monthly", "yearly"], categories:["personal", "public"], type:["SOAP"],  access:["API GW"], url:"http://stadgreidsla.skattur.is:2100",       status:ServiceStatusValue.OK},
    { id:5, owner:"Vinnumálastofnun", name:"Fæðingarorlofssjóður",pricing:null,                          categories:["personal", "public"], type:["react"], access:["API GW"], url:"http://faedingarorlofssjodur.vms.is:74200", status:ServiceStatusValue.ERROR},
    { id:6, owner:"Samgöngujstofa",   name:"Ökutækjaskrá",        pricing:["daily","monthly", "yearly"], categories:["personal", "public"], type:["SOAP"],  access:["API GW"], url:"http://okutaeki.samgongustofa.is:74200",    status:ServiceStatusValue.UNKNOWN},
  ];

export interface ServicesResult {
  result:Array<ServiceCardInformation>,
  nextCursor:number;
}

export interface GetServicesParameters {
  cursor:number, 
  limit:number, 
  owner:string, 
  name:string
}

const isValidNumber = (value:unknown):boolean => {
  return value !== undefined && value !==null && !isNaN(Number(value)) && value !== 'null';
}

const isValidString = (value:unknown):boolean => {
  return value !== undefined && value !==null && typeof value === "string" && String(value).length > 0 && value !== 'null';
}
export async function getServices(parameters:GetServicesParameters):Promise<ServicesResult> {
  const params = parameters !== null? parameters : {cursor:null, limit:null, owner:null, name:null};
  let filtered = OrgServices;
  if (isValidString(params.name)) {
    filtered = filtered.filter(e => e.name.includes(params.name));
  }
  if (isValidString(params.owner)) {
    filtered = filtered.filter(e => e.owner.includes(params.owner));
  }
  if (!isValidNumber(params.cursor)) {
    params.cursor = null;
  }
  if (!isValidNumber(params.limit)) {
    params.limit = null;
  }
  return await limitServices(filtered, params.cursor, params.limit);
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function limitServices(services, cursor:number, limit:number): Promise<ServicesResult> {

  await timeout(2000);
  const errorResult:ServicesResult = { result: null, nextCursor:null };
  const len = services.length;
  const searchCursor = cursor === null? 0 : cursor;
  let lastIndex = (limit === null || limit < 0 || limit > MAX_LIMIT)? MAX_LIMIT : limit;

  if (len < 1) {
    return errorResult;
  }
  
  const startIndex = ( cursor === null || cursor < 0 )? 0 : services.map(function(x) {return x.id; }).indexOf(searchCursor);

  if (startIndex < 0) {
    return errorResult;
  }

  lastIndex+=startIndex;
  
  let nextCursor = null;

  if (lastIndex >= len) {
    lastIndex = len;
  } else {
    nextCursor = services[lastIndex].id;
  }

  const ret:ServicesResult ={
    result: services.slice(startIndex, lastIndex),
    nextCursor:nextCursor
  }

  return ret;
}
