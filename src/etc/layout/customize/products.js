export default {
    container: {
        default_top: {
            active: true,
            sort_order: 1000,
            content: require('../../../customize/catalog/components/verticalproducts/top').default
        },
        selected_filter: {
            active: true,
            sort_order: 1500,
            content: require('@screens/catalog/components/verticalproducts/selectedfilter').default
        },
        default_categories: {
            active: true,
            sort_order: 2000,
            content: require('../../../customize/catalog/components/verticalproducts/categories').default
        },
        default_vertical_products: {
            active: true,
            sort_order: 3000,
            content: require('../../../customize/catalog/components/verticalproducts').default
        }
    },
    content: {

    }
}