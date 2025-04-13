import AXIOS_INSTANCE from '../axios';

export const getRecognitions = () =>
    AXIOS_INSTANCE.get('/core/employee/recognitions/');

export const getSentRecognitions = () =>
    AXIOS_INSTANCE.get('/core/employee/recognitions/sent/');

export const getReceivedRecognitions = () =>
    AXIOS_INSTANCE.get('/core/employee/recognitions/received/');

export const getCompanyHighlights = () =>
    AXIOS_INSTANCE.get('/core/employee/recognitions/company_highlights/');

export const createRecognition = (data) =>
    AXIOS_INSTANCE.post('/core/employee/recognitions/', data);

export const getRecognition = (id) =>
    AXIOS_INSTANCE.get(`/core/employee/recognitions/${id}/`);

export const updateRecognition = (id, data) =>
    AXIOS_INSTANCE.patch(`/core/employee/recognitions/${id}/`, data);

export const deleteRecognition = (id) =>
    AXIOS_INSTANCE.delete(`/core/employee/recognitions/${id}/`); 