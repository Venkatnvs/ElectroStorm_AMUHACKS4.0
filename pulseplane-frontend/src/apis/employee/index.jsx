import AXIOS_INSTANCE from '../axios';

export const core_employees_list = () =>
    AXIOS_INSTANCE.get('/core/employees/');

export const core_employees_create = data =>
    AXIOS_INSTANCE.post('/core/employees/', data);

export const core_employees_read = id =>
    AXIOS_INSTANCE.get(`/core/employees/${id}/`);

export const core_employees_update = (id, data) =>
    AXIOS_INSTANCE.put(`/core/employees/${id}/`, data);

export const core_employees_partial_update = (id, data) =>
    AXIOS_INSTANCE.patch(`/core/employees/${id}/`, data);

export const core_employees_delete = id =>
    AXIOS_INSTANCE.delete(`/core/employees/${id}/`);