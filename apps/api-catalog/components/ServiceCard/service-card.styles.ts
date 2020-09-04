
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

export default styles;