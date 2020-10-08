import React, { useState } from 'react'
import { AccordionItem, Box, GridContainer, Select } from '@island.is/island-ui/core'
import * as styles from './ServiceDetail.treat'
import cn from 'classnames'
import { ApiService } from '@island.is/api/schema'

import { RedocStandalone } from 'redoc';
import YamlParser from 'js-yaml'

import gql from 'graphql-tag'

import {
    GetOpenApiInput,
    Query,
    QueryGetOpenApiArgs
} from '@island.is/api/schema';
import { useLazyQuery, useQuery } from 'react-apollo'



export interface ServiceDetailProps {
    service: ApiService

}

export const GET_OPEN_API_QUERY = gql`
query GetOpenApi($input: GetOpenApiInput!) {
  getOpenApi(input: $input) {
    spec
  }
}
`

export const ServiceDetail = (props: ServiceDetailProps) => {

    if (props.service === null) {
        return (
            <GridContainer>
                <Box>
                    <h3>Þjónusta finnst ekki</h3>
                </Box>
            </GridContainer>
        )
    }



    type SelectOption = {
        label: string,
        value: any
    }

    enum CATEGORY {
        DATA,
        PRICING,
        ACCESS
    }

    let versionOptions: Array<SelectOption> = props.service.xroadIdentifier.map((e) => ({
        label: e.serviceCode.split('-').pop(),
        value: e
    }))
    if (versionOptions.length > 0) {
        versionOptions = versionOptions.sort((a, b) => b.label.localeCompare(a.label))
    }

    const inputValuesFromOption = (option: SelectOption):GetOpenApiInput => {
        const inputValues: GetOpenApiInput = {
            instance: option.value.instance,
            memberClass: option.value.memberClass,
            memberCode: option.value.memberCode,
            serviceCode: option.value.serviceCode,
            subsystemCode: option.value.subsystemCode
        }
        return inputValues;

    }
    

    const [expanded, setExpanded] = useState<boolean>(true);
    const [openApiObject, setOpenApiObject] = useState<GetOpenApiInput>(inputValuesFromOption(versionOptions[0]))
    const [getOpenApi, { data, loading, error }] = useLazyQuery<Query, QueryGetOpenApiArgs>(GET_OPEN_API_QUERY,
        {
            
            variables: {
                input: openApiObject,
            },
        })
        
        const onSelectChange = (option: SelectOption) => {
            const inputValues = inputValuesFromOption(option);
            setOpenApiObject(inputValues);
            console.log(inputValues);
            getOpenApi()
        }   

    const showCategory = (category: CATEGORY) => {
        let title = ""
        let cat = null;
        switch (category) {
            case CATEGORY.DATA:
                title = "Gögn";
                cat = props.service.data;
                break;
            case CATEGORY.PRICING: title = "Verð";
                cat = props.service.pricing;
                break;
            case CATEGORY.ACCESS: title = "Aðgengi";
                cat = props.service.access;
                break;
        }
        return (
            <div>
                <h2> {title}</h2>
                <div className={cn([styles.category])}>
                    {cat?.map((item, index) => {
                        return (
                            <div className={cn(styles.categoryItem)} key={index}>
                                {item}
                            </div>
                        )

                    })}
                </div>
            </div>
        )
    }

    const showError = () => {
        return (
            <div>
                Villa átti sér stað
            </div>
        )
    }
/*
    const showOpenApiSpec = (result:any) => {
        console.log(result.spec);
        let parsed = YamlParser.safeLoad(result.spec);
        let obj:object = {};
        if (typeof parsed !== "string") {
            obj = parsed;
        }

        <RedocStandalone spec={
            pets
            //JSON.parse(result.spec)
        } />
        
    }

    }
  */  
    
 
    // Main page
    return (
        <GridContainer>
            <Box className={cn(styles.root)}>
                <div>
                    <h1 className="name" data-id={props.service.id} >{props.service.name}</h1>
                    <Box className={cn(styles.selectContainer)} >
                        <div>
                            <Select
                                label="Version"
                                name="version"
                                defaultValue={versionOptions[0]}
                                options={versionOptions}
                                onChange={onSelectChange}
                                noOptionsMessage="Engar útgáfuupplýsingar"
                            />
                        </div>
                    </Box>

                </div>
                <div className={cn(styles.section)}>
                    <h2 className={cn(styles.sectionTitle)}>{props.service.name}</h2>
                    <p>{props.service.description}</p>
                </div>
                <div className={cn(styles.section)}>
                    <h2>{props.service.owner}</h2>
                    <p>todo: Hér vantar lýsingu á owner</p>
                </div>

                <div className={cn(styles.section)}>
                    {showCategory(CATEGORY.ACCESS)}
                    {showCategory(CATEGORY.DATA)}
                    {showCategory(CATEGORY.PRICING)}
                </div>

                <div className={cn(styles.section)}>
                    <h2>OpenAPI skjölun</h2>
                    
                    { data?.getOpenApi == null ? 
                        showError() 
                        :
                        <AccordionItem id="open-api-spec" label="Skjal" expanded={expanded} onToggle = {setExpanded} >
                            <RedocStandalone spec={JSON.parse(data.getOpenApi.spec)} />
                        </AccordionItem>
                    }
                    
                </div>

            </Box>
        </GridContainer>
    )
}