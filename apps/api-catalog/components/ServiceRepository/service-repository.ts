import {ServiceStatusValue } from  '..'
import { ServiceCardInformation } from '../ServiceCard/service-card';

const MAX_LIMIT = 4;

const enumToArray = (enumObject) => {
    const all = [];
    for(const key in enumObject){
        all.push(enumObject[key]);
    }
    return all;
}

export enum PRICING_CATEGORY {
    FREE   ='free',
    USAGE  ='usage',
    DAILY  ='daily',
    MONTHLY='monthly',
    YEARLY ='yearly',
    CUSTOM ='custom',
}

export enum DATA_CATEGORY {
    PUBLIC   ='public',
    OFFICIAL ='official',
    PERSONAL ='personal',
    HEALTH   ='health',
    FINANCIAL='financial',
}

export enum TYPE_CATEGORY {
    REACT  ='REACT',
    SOAP   ='SOAP',
    GRAPHQL='GraphQl',
}

export enum ACCESS_CATEGORY {
    X_ROAD  ='X-Road',
    API_GW  ='API GW',
}

const OrgServices:Array<ServiceCardInformation> =[
    { id:0, owner:"Þjóðskrá", name:"Fasteignaskrá", url:"http://fasteignaskra.thodskra.is:4700", status:ServiceStatusValue.OK,      
        pricing:[PRICING_CATEGORY.FREE],
        data:   [DATA_CATEGORY.PUBLIC],
        type:   [TYPE_CATEGORY.REACT], 
        access: [ACCESS_CATEGORY.X_ROAD] },
    { id:1, owner:"Þjóðskrá", name:"Einstaklingsskrá", url:"http://einstaklingskra.thodskra.is:4700", status:ServiceStatusValue.WARNING,
        pricing:[PRICING_CATEGORY.FREE, PRICING_CATEGORY.CUSTOM],                           
        data:   [DATA_CATEGORY.PERSONAL],                         
        type:   [TYPE_CATEGORY.REACT],
        access: [ACCESS_CATEGORY.X_ROAD] },
    { id:2, owner:"Þjóðskrá", name:"Staðfangaskrá", url:"http://stadfangaskra.thodskra.is:4700", status:ServiceStatusValue.ERROR, 
        pricing:[PRICING_CATEGORY.USAGE],                                                   
        data:   [DATA_CATEGORY.PUBLIC],                           
        type:[TYPE_CATEGORY.REACT],
        access:[ACCESS_CATEGORY.X_ROAD]},
    { id:3, owner:"Skatturinn", name:"Virðisaukaskattur", url:"http://vsk.skattur.is/:2100",              status:ServiceStatusValue.WARNING, 
        pricing:[PRICING_CATEGORY.DAILY,PRICING_CATEGORY.MONTHLY, PRICING_CATEGORY.YEARLY], 
        data:   [DATA_CATEGORY.PERSONAL, DATA_CATEGORY.PUBLIC],   
        type:   [TYPE_CATEGORY.SOAP], 
        access: [ACCESS_CATEGORY.API_GW]},
    { id:4, owner:"Skatturinn", name:"Staðgreiðsla", url:"http://stadgreidsla.skattur.is:2100", status:ServiceStatusValue.OK ,      
        pricing:[PRICING_CATEGORY.FREE,PRICING_CATEGORY.MONTHLY, PRICING_CATEGORY.YEARLY],  
        data:   [  DATA_CATEGORY.PERSONAL, DATA_CATEGORY.FINANCIAL],
        type:   [TYPE_CATEGORY.SOAP], access:[ACCESS_CATEGORY.API_GW]},
    { id:5, owner:"Vinnumálastofnun",name:"Fæðingarorlofssjóður",url:"http://faedingarorlofssjodur.vms.is:74200",status:ServiceStatusValue.ERROR, 
        pricing:[PRICING_CATEGORY.YEARLY],                                                  
        data:   [DATA_CATEGORY.PERSONAL, DATA_CATEGORY.PUBLIC],   
        type:   [TYPE_CATEGORY.REACT],
        access: [ACCESS_CATEGORY.API_GW]},
    { id:6, owner:"Samgöngustofa", name:"Ökutækjaskrá", url:"http://okutaeki.samgongustofa.is:74200", status:ServiceStatusValue.UNKNOWN,     
        pricing:[PRICING_CATEGORY.FREE,PRICING_CATEGORY.MONTHLY, PRICING_CATEGORY.YEARLY],  
        data:   [DATA_CATEGORY.PERSONAL, DATA_CATEGORY.PUBLIC],   
        type:   [TYPE_CATEGORY.SOAP], 
        access: [ACCESS_CATEGORY.API_GW]},
    { id:7, owner:"Dúddi í bæ", name:"Monthly free service", url:"http://asdf.asdf:74200", status:ServiceStatusValue.UNKNOWN, 
        pricing:[PRICING_CATEGORY.FREE,PRICING_CATEGORY.MONTHLY],                           
        data:   [DATA_CATEGORY.PUBLIC, DATA_CATEGORY.OFFICIAL, DATA_CATEGORY.PERSONAL,DATA_CATEGORY.HEALTH, DATA_CATEGORY.PUBLIC], 
        type:   [TYPE_CATEGORY.SOAP], 
        access: [ACCESS_CATEGORY.API_GW]}
];

export interface ServicesResult {
    result:Array<ServiceCardInformation>,
    prevCursor:number;
    nextCursor:number;
}

export interface GetServicesParameters {
    cursor:number
    limit:number
    owner:string
    name:string
    pricing:Array<string>
    data:Array<string>
    type:Array<string>
    access:Array<string>
}

export const getAllPriceCategories = ():Array<string>  => {
    return enumToArray(PRICING_CATEGORY);
}

export const getAllDataCategories = ():Array<string> => {
    return enumToArray(DATA_CATEGORY);
}

export const  getAllTypeCategories = ():Array<string> => {
    return enumToArray(TYPE_CATEGORY)
}

export const  getAllAccessCategories = ():Array<string> => {
    return enumToArray(ACCESS_CATEGORY)
}

const isValidNumber = (value:unknown):boolean => {
    return value !==null && !isNaN(Number(value));
}

const isValidString = (value:unknown):boolean => {
    return value !==null && typeof value === "string" && String(value).length > 0;
}

const ArrayContainsOneOrMoreOf = (checkMe:Array<string>, shouldContainOneOf:Array<string>):boolean => {
    for(let i = 0; i<checkMe.length; i++) {
        if (shouldContainOneOf.includes(checkMe[i])) {
            return true;
        }
    }
    return false;
}

export async function getServices(parameters:GetServicesParameters):Promise<ServicesResult> {
    const params:GetServicesParameters = parameters !== null? parameters : {cursor:null, limit:null, owner:null, name:null, pricing:null, data:null, type:null, access:null};
    let filtered = OrgServices;
    if (isValidString(params.name)) {
        filtered = filtered.filter(e => e.name.includes(params.name));
    }
    if (isValidString(params.owner)) {
        filtered = filtered.filter(e => e.owner.includes(params.owner));
    }

    //data filter
    if ( params.data !== null) {
            filtered = filtered.filter(function (e) { 
                return ArrayContainsOneOrMoreOf(e.data, params.data)
            }
        );
    }

    //pricing filter
    if ( params.pricing !== null) {
        filtered = filtered.filter(function (e) { 
            return ArrayContainsOneOrMoreOf(e.pricing, params.pricing)
        }
        );
    }


    //type filter
    if ( params.type !== null) {
        filtered = filtered.filter(function (e) { 
            return ArrayContainsOneOrMoreOf(e.type, params.type)
        }
        );
    }


    //access filter
    if ( params.access !== null) {
        filtered = filtered.filter(function (e) { 
            return ArrayContainsOneOrMoreOf(e.access, params.access)
        }
        );
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
    await timeout(1000);
    const errorResult:ServicesResult = { result: null, prevCursor:null, nextCursor:null };
    const len = services.length;
    const searchCursor = cursor === null? 0 : cursor;
    const safeLimit = (limit === null || limit < 0 || limit > MAX_LIMIT)? MAX_LIMIT : limit;

    if (len < 1) {
        return errorResult;
    }

    const startIndex = ( cursor === null || cursor < 0 )? 0 : services.map(function(x) {return x.id; }).indexOf(searchCursor);

    if (startIndex < 0) {
        return errorResult;
    }

    let lastIndex = safeLimit + startIndex;

    let nextCursor = null;

    if (lastIndex >= len) {
        lastIndex = len;
    } else {
        nextCursor = services[lastIndex].id;
    }

    let prevCursor = null;

    if (startIndex > 0) {
        const prevIndex = startIndex-safeLimit < 0? 0 : startIndex-safeLimit;
        prevCursor = services[prevIndex].id;
    }

    const ret:ServicesResult = {
        result: services.slice(startIndex, lastIndex),
        nextCursor:nextCursor,
        prevCursor:prevCursor
    }

    return ret;
}