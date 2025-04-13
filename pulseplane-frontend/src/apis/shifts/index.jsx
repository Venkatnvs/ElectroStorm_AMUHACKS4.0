import AXIOS_INSTANCE from '../axios';

export const core_sheduling_schedules_list = () =>
    AXIOS_INSTANCE.get('/core/sheduling/schedules/');

export const core_sheduling_schedules_create = data =>
    AXIOS_INSTANCE.post('/core/sheduling/schedules/', data);

export const core_sheduling_schedules_read = id =>
    AXIOS_INSTANCE.get(`/core/sheduling/schedules/${id}/`);

export const core_sheduling_schedules_update = (id, data) =>
    AXIOS_INSTANCE.put(`/core/sheduling/schedules/${id}/`, data);

export const core_sheduling_schedules_partial_update = (id, data) =>
    AXIOS_INSTANCE.patch(`/core/sheduling/schedules/${id}/`, data);

export const core_sheduling_schedules_delete = id =>
    AXIOS_INSTANCE.delete(`/core/sheduling/schedules/${id}/`);

export const core_sheduling_detailed_schedules_list = () =>
    AXIOS_INSTANCE.get('/core/sheduling/detailed-schedules/');

export const core_sheduling_detailed_schedules_read = (id) =>
    AXIOS_INSTANCE.get(`/core/sheduling/detailed-schedules/${id}/`);

export const core_sheduling_schedules_delete_user = (id, data) => 
    AXIOS_INSTANCE.delete(`/core/sheduling/schedules/${id}/delete-user/`, {data});

export const core_sheduling_detailed_schedules2_list = () =>
    AXIOS_INSTANCE.get('/core/sheduling/detailed-schedules2/');