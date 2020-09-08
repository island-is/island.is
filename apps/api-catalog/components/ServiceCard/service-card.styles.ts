//import { blue100 } from '@island.is/island-ui/theme';
//import { relative } from 'path';
//import { CSSProperties } from 'treat/lib/types';

//import { right } from 'libs/island-ui/core/src/lib/Timeline/Timeline.treat';

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
          paddingTop:0,
          paddingBottom:40
      },
      name:{
          fontSize:32,
          marginTop:20
      },
      owner:{
          fontSize:16,
          marginTop:20,
          marginBottom:20,
  
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
      },
      serviceTexts: {
          
      },
      serviceStatusContainer: {
          display:'flex',
          justifyContent:'space-between',
      },
      serviceStatus: {
          width:50,
          height:50,
          borderBottomLeftRadius:50,
          borderTopRightRadius:8,
          /*background:'gray'*/
      }
  };
  
  export default styles;