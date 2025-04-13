import AXIOS_INSTANCE from '../axios';

export const core_emp_leaves_detailed_list = () => 
    AXIOS_INSTANCE.get(`/core/emp/leaves/detailed/`);

export const core_emp_leaves_detailed_read = id =>
    AXIOS_INSTANCE.get(`/core/emp/leaves/detailed/${id}/`);

export const core_emp_leaves_detailed_update = (id, data) =>
    AXIOS_INSTANCE.put(`/core/emp/leaves/detailed/${id}/`, data);

export const core_emp_leaves_detailed_partial_update = (id, data) =>
    AXIOS_INSTANCE.patch(`/core/emp/leaves/detailed/${id}/`, data);

export const core_emp_leaves_detailed_delete = id =>
    AXIOS_INSTANCE.delete(`/core/emp/leaves/detailed/${id}/`);