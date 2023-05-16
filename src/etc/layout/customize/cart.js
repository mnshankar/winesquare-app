export default {
    container: {
        default_checkout_button: {
            active: true,
            sort_order: 1000,
            content: require('../../../customize/checkout/components/checkoutbutton').default
        },
    },
    content: {
        customize_plan: {
            active: true,
            sort_order: 100,
            content: require('../../../customize/checkout/components/quoteitem/plan').default,
            left: true
        },
        default_estimate_shipping: {
            active: false,
            sort_order: 500,
            content: require('@screens/checkout/components/estimateshipping').default,
            left: true
        },
        default_list: {
            active: true,
            sort_order: 1000,
            content: require('../../../customize/checkout/components/quoteitem/list').default,
            left: true
        },
        default_total: {
            active: true,
            sort_order: 3000,
            content: require('../../../customize/checkout/components/totals').default,
            left: false
        },
        default_delivery_instructions: {
            active: true,
            sort_order: 4000,
            content: require('../../../customize/checkout/components/deliveryInstructions').default,
            left: false
        }
    }
}
