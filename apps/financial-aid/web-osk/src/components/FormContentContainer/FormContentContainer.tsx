import React from 'react'
import { GridColumn } from '@island.is/island-ui/core'
import * as styles from './FormContentContainer.treat'

interface Props {
  children: React.ReactNode;
}

const FormContentContainer: React.FC<Props> = (props) => {
  // return ( 
  //   <GridColumn
  //     span={['9/9', '9/9', '7/9', '7/9']}
  //     offset={['0', '0', '1/9', '1/9']}
  //   >
  //     {props.children}
  //   </GridColumn>
  // )
  
  return (
    <div className={styles.formContainer}>
       {props.children}
    </div>
  )
}

export default FormContentContainer
