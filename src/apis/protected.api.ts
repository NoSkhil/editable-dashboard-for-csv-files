import HttpClient from './base.api';
import { getUserToken, SERVER_URL } from '../globals';
import { AxiosRequestConfig } from 'axios';
import routes from './routes';

class MainApiProtected extends HttpClient {
  constructor() {
    super(`${SERVER_URL}`);

    this._initializeRequestInterceptor();
  }

  _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(
      this._handleRequest,
      this._handleError
    );
  }

  _handleRequest = (config: AxiosRequestConfig) => {
    config.headers['authorization'] = `Bearer ${getUserToken()}`;

    return config;
  }

  addDoctorInfo = async (data: [Object]) => {
    return await this.instance.post(`${routes.DOCTOR}/add/info`,data);
  }

  getDoctorInfo = async () => {
    return await this.instance.get(`${routes.DOCTOR}/fetch/info`);
  }

  editDoctorInfo = async (doctorId: String, data: Object ) => {
    return await this.instance.post(
      `${routes.DOCTOR}/edit/${doctorId}`,data
    );
  }

  deleteDoctorInfo = async (doctorId: String) => {
    return await this.instance.get(`${routes.DOCTOR}/delete/${doctorId}`);
  }
}

export default MainApiProtected;
