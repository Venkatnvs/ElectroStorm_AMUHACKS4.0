import AXIOS_INSTANCE from '../axios';

export const core_emp_leaves_list = () => 
    AXIOS_INSTANCE.get(`/core/emp/leaves/`);

export const core_emp_leaves_create = data => 
    AXIOS_INSTANCE.post(`/core/emp/leaves/`, data);

export const core_emp_leaves_read = id =>
    AXIOS_INSTANCE.get(`/core/emp/leaves/${id}/`);

export const core_emp_leaves_update = (id, data) =>
    AXIOS_INSTANCE.put(`/core/emp/leaves/${id}/`, data);

export const core_emp_leaves_partial_update = (id, data) =>
    AXIOS_INSTANCE.patch(`/core/emp/leaves/${id}/`, data);

export const core_emp_leaves_delete = id =>
    AXIOS_INSTANCE.delete(`/core/emp/leaves/${id}/`);