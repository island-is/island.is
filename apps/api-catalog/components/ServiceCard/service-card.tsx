import React from 'react'
import { Box } from '@island.is/island-ui/core'
import { getQueryParser } from 'next/dist/next-server/server/api-utils';

const sharedStyles = {
  item:{
    borderRadius:15,
    paddingTop:5,
    paddingBottom:5,
    paddingLeft:15,
    paddingRight:15,
    marginRight:10,
    fontSize:14
  }
};

const styles = {
    card:{
        paddingLeft:40,
        paddingTop:40,
        paddingBottom:40
    },
    owner:{
        fontSize:32,
        marginBottom:20
    },
    name:{
        fontSize:16,
        marginBottom:20

    },
    category:{
        display:'flex',
        justifyContent:'spaceBetween'
    },
    priceItem:{
        background: 'lightgray',
        borderRadius:sharedStyles.item.borderRadius,
        paddingTop :sharedStyles.item.paddingTop,
        paddingBottom:sharedStyles.item.paddingBottom,
        paddingLeft :sharedStyles.item.paddingLeft,
        paddingRight:sharedStyles.item.paddingRight,
        marginRight:sharedStyles.item.marginRight,
        fontSize:sharedStyles.item.fontSize
    },
    categories:{
        background: '#dedea5',
        borderRadius:sharedStyles.item.borderRadius,
        paddingTop :sharedStyles.item.paddingTop,
        paddingBottom:sharedStyles.item.paddingBottom,
        paddingLeft :sharedStyles.item.paddingLeft,
        paddingRight:sharedStyles.item.paddingRight,
        marginRight:sharedStyles.item.marginRight,
        fontSize:sharedStyles.item.fontSize
    },
    type: {
        background:'green',
        borderRadius:sharedStyles.item.borderRadius,
        paddingTop :sharedStyles.item.paddingTop,
        paddingBottom:sharedStyles.item.paddingBottom,
        paddingLeft :sharedStyles.item.paddingLeft,
        paddingRight:sharedStyles.item.paddingRight,
        marginRight:sharedStyles.item.marginRight,
        fontSize:sharedStyles.item.fontSize
    },
    access: {
        background:'yellow',
        borderRadius:sharedStyles.item.borderRadius,
        paddingTop :sharedStyles.item.paddingTop,
        paddingBottom:sharedStyles.item.paddingBottom,
        paddingLeft :sharedStyles.item.paddingLeft,
        paddingRight:sharedStyles.item.paddingRight,
        marginRight:sharedStyles.item.marginRight,
        fontSize:sharedStyles.item.fontSize
    }
};

//import './service-card.scss'

export interface ServiceCardInformation {
    name: string;
    owner:string;
    pricing:Array<string>;
    categories:Array<string>
    type:Array<string>;
    access:Array<string>;
}

export interface ServiceCardProps {
  service: ServiceCardInformation
}

export const ServiceCard = (props: ServiceCardProps) => {
  return (
    <Box
      boxShadow="large"
      borderRadius="large"
      style={styles.card}
    >
    <p style={styles.owner}>{props.service.owner}</p>
    <p style={styles.name}>{props.service.name}</p>
    
    
        <div className="prices" style={styles.category} >
          {	props.service.pricing?.map((item, index) => (
                <div style={styles.priceItem} className="card-item" key={index}>{item + ''} </div>
            ))
          }
        </div>
        <div className="categories" style={styles.category} >
          {	props.service.categories?.map((item, index) => (
                <div style={styles.categories} className="card-item" key={index}>{item + ''} </div>
            ))
          }
        </div>
        <div className="type" style={styles.category} >
          {	props.service.type?.map((item, index) => (
                <div style={styles.type} className="card-item" key={index}>{item + ''} </div>
            ))
          }
        </div>
        <div className="access" style={styles.category} >
          {	props.service.access?.map((item, index) => (
                <div style={styles.access} className="card-item" key={index}>{item + ''} </div>
            ))
          }
        </div>
</Box>
  )
}

//export default ServiceCard
