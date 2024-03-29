import { products } from '@helper/constants';
import Device from '@helper/device';

export default {
    container : {

    },
    content : {
        default_catalog_header : {
            active: true,
            sort_order: 1000,
            content: require('../../../customize/catalog/components/categories/categoriesHeader').default
        },
        default_catalog_products_list : {
            active: true,
            sort_order: 2000,
            content: require('../../../customize/catalog/components/categories/horizontalProducts').default,
            data: {
                api: products,
                param: {
                    limit : 6,
                    offset: 0,
                },
                type: {
                    name: 'idAfter',
                    param : 'filter[cat_id]',
                },
                redux_action: 'add_products_data',
                redux_data_key: 'products_data',
                idName: 'cateId'
            }
        },
        default_categories: {
            active: true,
            sort_order: 3000,
            content: require('../../../customize/catalog/components/categories').default
        }
    }
}
