import {SERVICE_STATUS } from  '..'

const MAX_LIMIT = 3;

export interface ServiceCardInformation {
    id:string
    name: string;
    owner:string;
    pricing:Array<string>;
    data:Array<string>
    type:Array<string>;
    access:Array<string>;
    status:SERVICE_STATUS;
}

export interface ServicesResult {
    result:Array<ServiceCardInformation>,
    prevCursor:string;
    nextCursor:string;
}

export interface ServiceDetails {
    id:string;
    name: string;
    description: string;
    owner:string;
    url:string;
    pricing:Array<string>;
    data:Array<string>
    type:Array<string>;
    access:Array<string>;
    status:SERVICE_STATUS;
}

export interface ServiceResult {
    result:ServiceDetails,
}

export interface GetServicesParameters {
    cursor:string
    limit:number
    owner:string
    name:string
    pricing:Array<string>
    data:Array<string>
    type:Array<string>
    access:Array<string>,
}

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

const OrgServices:Array<ServiceDetails> =[
    { id:'0', owner:"Þjóðskrá", name:"Fasteignaskrá", url:"http://fasteignaskra.thodskra.is:4700", description:"Fasteignaskráarlýsing",
        status:SERVICE_STATUS.OK,      
        pricing:[PRICING_CATEGORY.FREE],
        data:   [DATA_CATEGORY.PUBLIC],
        type:   [TYPE_CATEGORY.REACT], 
        access: [ACCESS_CATEGORY.X_ROAD] },
    { id:'1', owner:"Þjóðskrá", name:"Einstaklingsskrá", url:"http://einstaklingskra.thodskra.is:4700", description:"Einstaklingarskráarlýsing",
        status:SERVICE_STATUS.WARNING,
        pricing:[PRICING_CATEGORY.FREE, PRICING_CATEGORY.CUSTOM],                           
        data:   [DATA_CATEGORY.PERSONAL],                         
        type:   [TYPE_CATEGORY.REACT],
        access: [ACCESS_CATEGORY.X_ROAD] },
    { id:'2', owner:"Þjóðskrá", name:"Staðfangaskrá", url:"http://stadfangaskra.thodskra.is:4700", description:"Staðfangaskráarlýsing", 
        status:SERVICE_STATUS.ERROR, 
        pricing:[PRICING_CATEGORY.USAGE],                                                   
        data:   [DATA_CATEGORY.PUBLIC],                           
        type:[TYPE_CATEGORY.REACT],
        access:[ACCESS_CATEGORY.X_ROAD]},
    { id:'3', owner:"Skatturinn", name:"Virðisaukaskattur", url:"http://vsk.skattur.is/:2100",description:"Virðisaukaskattarlýsing",
        status:SERVICE_STATUS.WARNING, 
        pricing:[PRICING_CATEGORY.DAILY,PRICING_CATEGORY.MONTHLY, PRICING_CATEGORY.YEARLY], 
        data:   [DATA_CATEGORY.PERSONAL, DATA_CATEGORY.PUBLIC],   
        type:   [TYPE_CATEGORY.SOAP], 
        access: [ACCESS_CATEGORY.API_GW]},
    { id:'4', owner:"Skatturinn", name:"Staðgreiðsla", url:"http://stadgreidsla.skattur.is:2100", description:"Staðgreiðslulýsing",
        status:SERVICE_STATUS.OK ,      
        pricing:[PRICING_CATEGORY.FREE,PRICING_CATEGORY.MONTHLY, PRICING_CATEGORY.YEARLY],  
        data:   [  DATA_CATEGORY.PERSONAL, DATA_CATEGORY.FINANCIAL],
        type:   [TYPE_CATEGORY.SOAP], access:[ACCESS_CATEGORY.API_GW]},
    { id:'5', owner:"Vinnumálastofnun",name:"Fæðingarorlofssjóður",url:"http://faedingarorlofssjodur.vms.is:74200",description:"Fæðingarorlofssjóðslýsing",
        status:SERVICE_STATUS.ERROR, 
        pricing:[PRICING_CATEGORY.YEARLY],                                                  
        data:   [DATA_CATEGORY.PERSONAL, DATA_CATEGORY.PUBLIC],   
        type:   [TYPE_CATEGORY.REACT],
        access: [ACCESS_CATEGORY.API_GW]},
    { id:'6', owner:"Samgöngustofa", name:"Ökutækjaskrá", url:"http://okutaeki.samgongustofa.is:74200", description:"Ökutækjaskráarlýsing",
        status:SERVICE_STATUS.UNKNOWN,     
        pricing:[PRICING_CATEGORY.FREE,PRICING_CATEGORY.MONTHLY, PRICING_CATEGORY.YEARLY],  
        data:   [DATA_CATEGORY.PERSONAL, DATA_CATEGORY.PUBLIC],   
        type:   [TYPE_CATEGORY.SOAP], 
        access: [ACCESS_CATEGORY.API_GW]},
    { id:'7', owner:"Dúddi í bæ", name:"Monthly free service", url:"http://asdf.asdf:74200", description:"MonthlyFreeServiceLýsing",
        status:SERVICE_STATUS.UNKNOWN, 
        pricing:[PRICING_CATEGORY.FREE,PRICING_CATEGORY.MONTHLY],                           
        data:   [DATA_CATEGORY.PUBLIC, DATA_CATEGORY.OFFICIAL, DATA_CATEGORY.PERSONAL,DATA_CATEGORY.HEALTH, DATA_CATEGORY.PUBLIC], 
        type:   [TYPE_CATEGORY.SOAP], 
        access: [ACCESS_CATEGORY.API_GW]}
];


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

const isValidId = (value:unknown):boolean => {
    return isValidString(value);
}

const ArrayContainsOneOrMoreOf = (checkMe:Array<string>, shouldContainOneOf:Array<string>):boolean => {
    
    if (shouldContainOneOf === undefined || shouldContainOneOf === null || shouldContainOneOf.length < 1 ) {
        return true;
    }

    for(let i = 0; i<checkMe.length; i++) {
        if (shouldContainOneOf.includes(checkMe[i])) {
            return true;
        }
    }
    return false;
}

const ParameterArraysContainsOneOrMoreOf = (service:ServiceCardInformation, parameters:GetServicesParameters):boolean => {

        return ( ArrayContainsOneOrMoreOf(service.pricing, parameters.pricing) &&
                 ArrayContainsOneOrMoreOf(service.data, parameters.data)       &&
                 ArrayContainsOneOrMoreOf(service.type, parameters.type)       &&
                 ArrayContainsOneOrMoreOf(service.access, parameters.access)    );
}

export async function getService(id: string):Promise<ServiceResult> {
    await timeout(500);
    const filter = OrgServices.filter( e => {
        return e.id === id
    });
    if (filter.length < 1){
        return { result:null};
    } 
    
    return { result:filter[0] };
    
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
    
    if ( params.pricing !== null) {
        filtered = JSON.parse(JSON.stringify(filtered.filter(function (e) { 
            return ParameterArraysContainsOneOrMoreOf(e, params)
        }))
        );
    }

    if (!isValidId(params.cursor)) {
        params.cursor = null;
    }
    if (!isValidNumber(params.limit)) {
        params.limit = null;
    }
    


    //Convert to ServiceCardInformation
    const limited = await limitServices(filtered, params.cursor, params.limit);

    if (limited.result === null || limited.result.length < 1)
        return limited;

    
    //replace array of ServiceDetails with array of ServiceCardInformation
    const cardInfoList:Array<ServiceCardInformation> = [];
    limited.result.forEach(e => {
        cardInfoList.push({
            id:e.id,
            name:e.name,
            owner:e.owner,
            status:e.status,
            access:e.access,
            data: e.data,
            pricing:e.pricing,
            type:e.type
        })
    });
    limited.result = cardInfoList;
    return limited;
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function limitServices(services, cursor:string, limit:number): Promise<ServicesResult> {
    await timeout(1000);
    const errorResult:ServicesResult = { result: null, prevCursor:null, nextCursor:null };
    const len = services.length;
    const searchCursor = cursor === null? '0' : cursor;
    const safeLimit = (limit === null || limit < 0 || limit > MAX_LIMIT)? MAX_LIMIT : limit;

    if (len < 1) {
        return errorResult;
    }
    const startIndex = ( cursor === null || !isValidId(cursor) )? 0 : services.map(function(x) {return x.id; }).indexOf(searchCursor);

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