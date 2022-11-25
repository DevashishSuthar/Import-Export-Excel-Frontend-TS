import Axios from 'configs/AxiosConfig';
import { FILE_ENDPOINTS } from 'constants/ApiEndpointsContstant';

export const generateExcelFromJson = (data: FormData) => {
    return Axios.post(FILE_ENDPOINTS.generateExcelFromJson, data);
};

export const generateJsonFromExcel = (data: FormData) => {
    return Axios.post(FILE_ENDPOINTS.generateJsonFromExcel, data);
};