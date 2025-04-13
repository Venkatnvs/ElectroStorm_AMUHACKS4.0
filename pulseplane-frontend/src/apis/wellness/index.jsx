import AXIOS_INSTANCE from '../axios';

export const wellness_check_create = data =>
    AXIOS_INSTANCE.post('/core/emp/wellness/', data);

export const wellness_check_list = () =>
    AXIOS_INSTANCE.get('/core/emp/wellness/history/');


