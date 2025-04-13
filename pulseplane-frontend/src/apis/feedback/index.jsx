import AXIOS_INSTANCE from '../axios';

export const core_emp_feedback_list = () =>
    AXIOS_INSTANCE.get('/core/emp/feedback/');

export const core_emp_feedback_create = data =>
    AXIOS_INSTANCE.post('/core/emp/feedback/', data);

export const core_emp_feedback_read = id =>
    AXIOS_INSTANCE.get(`/core/emp/feedback/${id}/`);

export const core_emp_feedback_update = (id, data) =>
    AXIOS_INSTANCE.put(`/core/emp/feedback/${id}/`, data);

export const core_emp_feedback_partial_update = (id, data) =>
    AXIOS_INSTANCE.patch(`/core/emp/feedback/${id}/`, data);

export const core_emp_feedback_delete = id =>
    AXIOS_INSTANCE.delete(`/core/emp/feedback/${id}/`);

export const core_emp_feedback2_list = () =>
    AXIOS_INSTANCE.get('/core/emp/feedback2/');