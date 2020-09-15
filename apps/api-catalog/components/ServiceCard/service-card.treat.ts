import { style} from 'treat'

export const card = style({
    padding:40,
    marginBottom:40
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


export const categoryLabel = style({
    fontFamily : 'areal,sans-serif'
});