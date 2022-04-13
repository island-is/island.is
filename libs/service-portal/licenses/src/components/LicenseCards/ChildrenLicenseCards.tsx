import React, { FC } from 'react'
import { GridColumn, GridRow, Stack } from '@island.is/island-ui/core'
import { DrivingLicense } from '../DrivingLicense/DrivingLicense'
import { DrivingLicenseType } from '@island.is/service-portal/core'
import PassportLicense from '../PassportLicense/PassportLicense'
import EmptyCard from '../EmptyCard/EmptyCard'
interface Props {
  data?: any
}
const titleCase = (str: string) => {
  const splitStr = str.toLowerCase().split(' ')

  for (let i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
  }
  return splitStr.join(' ')
}

const ChildrenLicenseCards: FC<Props> = ({ data }) => {
  return (
    <GridRow>
      <GridColumn span="12/12">
        <Stack space={2}>
          {/* When other licenses are available - map through them */}
          {/* {data?.driverLicenses?.map((item,index) => {
              return  <DrivingLicense
              id={data.drivingLicenses.id.toString()}
              expireDate={data.drivingLicenses.gildirTil.toString()}
            />
          }) 
           
          )} */}
          {/* Mappa í genum array sem a bæði passport object og driving license */}
          {data?.passportData?.map((item: any, index: number) => {
            const fullName = titleCase(
              item.displayFirstName + ' ' + item.displayLastName,
            )
            return !item.number ? (
              <EmptyCard
                image="./assets/images/stjornarrad.svg"
                title={fullName}
                text={'Þú átt engin gild ökuskírteini'}
              />
            ) : (
              <PassportLicense
                key={index + item.number}
                id={item.number}
                expireDate={item.expirationDate}
                children={true}
                name={fullName}
              />
            )
          })}
        </Stack>
      </GridColumn>
    </GridRow>
  )
}

export default ChildrenLicenseCards
