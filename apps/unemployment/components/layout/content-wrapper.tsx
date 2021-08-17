import React, { ReactNode } from 'react'
import {
  GridRow,
  GridColumn,
  GridContainer,
  Box,
  Stack,
} from '@island.is/island-ui/core'


  
  const ContentWrapper: React.FC = ({ children }) => {
    return (<GridContainer>
      <GridRow>
        <GridColumn span={['12/12', '12/12', '7/12', '8/12', '9/12']}>
          {children}
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '5/12', '4/12', '3/12']}>
Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatem amet corporis omnis delectus saepe natus neque voluptate reprehenderit laboriosam eum ipsa debitis accusantium ducimus quidem, nobis non nesciunt doloremque quod.
Cum assumenda porro distinctio adipisci, eaque perferendis necessitatibus similique molestiae, sunt quibusdam fugiat blanditiis, veniam labore aliquam doloremque molestias enim incidunt possimus! Corporis qui assumenda omnis? Animi deserunt facere nemo.
Officiis illum eum non, eligendi sint facere eius nisi? Excepturi omnis veniam molestiae accusantium corporis aliquid dolore, quibusdam, quo aliquam molestias repellendus, iusto earum repudiandae unde nemo minus! Unde, optio.
Voluptate laboriosam culpa, neque omnis aspernatur delectus accusantium at maxime earum deleniti officia voluptatem optio ea facere architecto labore modi id placeat iste laborum. Praesentium illo fugiat adipisci ex magnam?
Maiores quas, quia saepe exercitationem aut non dicta! Animi consequatur eveniet optio asperiores omnis unde, vitae, nulla officiis laboriosam enim reprehenderit voluptas commodi et dicta obcaecati explicabo quidem quo eaque.
        </GridColumn>
      </GridRow>
    </GridContainer>)
  }


export default ContentWrapper