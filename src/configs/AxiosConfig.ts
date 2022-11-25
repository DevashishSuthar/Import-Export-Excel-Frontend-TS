import axios from 'axios';

import { REACT_APP_API_URL } from './EnvConfig';
import { showLoader, hideLoader } from '../redux/Slices/LoaderSlice';
import store from '../store/Store';

const axiosInstance = axios.create({
    baseURL: REACT_APP_API_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        store.dispatch(showLoader());

        return config;
    },
    (error) => {
        store.dispatch(hideLoader());
        Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        store.dispatch(hideLoader());
        return response;
    },
    (error) => {
        store.dispatch(hideLoader());
        return error;
    }
);

export default axiosInstance;
