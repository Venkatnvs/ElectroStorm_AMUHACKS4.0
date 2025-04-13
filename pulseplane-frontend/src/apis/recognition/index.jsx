import AXIOS_INSTANCE from '../axios';

// Badge-related API calls
export const fetchBadgesList = () =>
    AXIOS_INSTANCE.get('/core/emp/recognition/badges/');

export const createBadge = (data) =>
    AXIOS_INSTANCE.post('/core/emp/recognition/badges/', data);

export const updateBadge = (badgeId, data) =>
    AXIOS_INSTANCE.put(`/core/emp/recognition/badges/${badgeId}/`, data);

export const deleteBadge = (badgeId) =>
    AXIOS_INSTANCE.delete(`/core/emp/recognition/badges/${badgeId}/`);

// Award-related API calls
export const fetchAwardsList = () =>
    AXIOS_INSTANCE.get('/core/emp/recognition/awards/');

export const fetchUserAwards = (userId) =>
    AXIOS_INSTANCE.get(`/core/emp/recognition/awards/user/${userId}/`);

export const createAward = (data) =>
    AXIOS_INSTANCE.post('/core/emp/recognition/awards/', data);

export const deleteAward = (awardId) =>
    AXIOS_INSTANCE.delete(`/core/emp/recognition/awards/${awardId}/`); 