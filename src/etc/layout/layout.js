export default {
    simi_simivideo_40 : {
product: require('./plugins/simi_simivideo_40/product').default,
},
simi_paypalexpress_40 : {
product: require('./plugins/simi_paypalexpress_40/product').default,
},
simi_simiproductreview_40 : {
product: require('./plugins/simi_simiproductreview_40/product').default,
},
simi_simicouponcode_40 : {
cart: require('./plugins/simi_simicouponcode_40/cart').default,
checkout: require('./plugins/simi_simicouponcode_40/checkout').default,
},
customize : {
    products: require('./customize/products').default,
    product: require('./customize/product').default,
    category: require('./customize/category').default,
    cart: require('./customize/cart').default,
    checkout: require('./customize/checkout').default,
    thankyou: require('./customize/thankyou').default,
    matrix: require('./customize/matrix').default,
    myaccount: require('./customize/myaccount').default
},

}
