import AXIOS_INSTANCE from '../axios';

export const core_dashboard_data_count_list = () =>
    AXIOS_INSTANCE.get('/core/dashboard/data-count/');

export const core_dashboard_data_count_list2 = () =>
    AXIOS_INSTANCE.get('/core/dashboard/data-count2/');

export const core_dashboard_graph_data_list = () =>
    AXIOS_INSTANCE.get('/core/dashboard/graph-data/');