import { style} from 'treat'
//import cn from 'classnames'

export const card = style({
    paddingLeft:40,
    paddingTop:0,
    paddingBottom:40
  })

export const name = style({
    fontSize:32,
    marginTop:20
})

export const owner = style({
    fontSize:16,
          marginTop:20,
          marginBottom:20,
})

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

export const categories = style ({
    background: '#dedea5',
    borderRadius:sharedStyles.item.borderRadius,
    paddingTop :sharedStyles.item.paddingTop,
    paddingBottom:sharedStyles.item.paddingBottom,
    paddingLeft :sharedStyles.item.paddingLeft,
    paddingRight:sharedStyles.item.paddingRight,
    marginRight:sharedStyles.item.marginRight,
    fontSize:sharedStyles.item.fontSize
})

export const priceItem=style ({
    background: 'lightgray',
    borderRadius:sharedStyles.item.borderRadius,
    paddingTop :sharedStyles.item.paddingTop,
    paddingBottom:sharedStyles.item.paddingBottom,
    paddingLeft :sharedStyles.item.paddingLeft,
    paddingRight:sharedStyles.item.paddingRight,
    marginRight:sharedStyles.item.marginRight,
    fontSize:sharedStyles.item.fontSize
})

export const category = style({
    display:'flex',
    justifyContent:'spaceBetween'
})

export const access = style({
    background:'yellow',
    borderRadius:sharedStyles.item.borderRadius,
    paddingTop :sharedStyles.item.paddingTop,
    paddingBottom:sharedStyles.item.paddingBottom,
    paddingLeft :sharedStyles.item.paddingLeft,
    paddingRight:sharedStyles.item.paddingRight,
    marginRight:sharedStyles.item.marginRight,
    fontSize:sharedStyles.item.fontSize
})

export const type = style ({
    background:'green',
    borderRadius:sharedStyles.item.borderRadius,
    paddingTop :sharedStyles.item.paddingTop,
    paddingBottom:sharedStyles.item.paddingBottom,
    paddingLeft :sharedStyles.item.paddingLeft,
    paddingRight:sharedStyles.item.paddingRight,
    marginRight:sharedStyles.item.marginRight,
    fontSize:sharedStyles.item.fontSize
})


export const serviceStatus = style({
    width:50,
    height:50,
    borderBottomLeftRadius:50,
    borderTopRightRadius:8
});

export const serviceStatusContainer = style({
    display:'flex',
    justifyContent:'space-between',
})

export const serviceTexts = style({
    fontFamily : 'areal,sans-serif'
});