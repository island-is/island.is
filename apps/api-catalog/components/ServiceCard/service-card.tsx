import React from 'react'

//import './service-card.scss'

export interface ServiceCardInformation {
    name: string;
    owner:string;
    pricing:Array<string>;
    categories:Array<string>
    type:Array<string>;
}

export interface ServiceCardProps {
  service: ServiceCardInformation
}

export const ServiceCard = (props: ServiceCardProps) => {
  return (
    <div>
    <hr />
    <p className="service-name">Name: {props.service.name}</p>
    <p>owner: {props.service.owner}</p>
      <ul className="prices">
        {	props.service.pricing?.map((item, index) => (
              <li className="card-item" key={index}>{item + ''} </li>
          ))
        }
    </ul>
    <hr />
</div>
  )
}

//export default ServiceCard
