import { Container } from 'typedi'
import { MainApiProtected } from '../apis';

class DoctorService {
  protectedApiService: MainApiProtected;

  constructor() {
    this.protectedApiService = Container.get(MainApiProtected);
  }

  getDoctorInfo = (): Promise<any> => {
    try {
      return this.protectedApiService.getDoctorInfo();
    } catch (error) {
      throw error;
    }
  }

  addDoctorInfo = (data: [Object]): Promise<any> => {
    try {
      return this.protectedApiService.addDoctorInfo(data);
    } catch (error) {
      throw error;
    }
  }

  editDoctorInfo = (doctorId: String, data: Object): Promise<any> => {
    try {
      return this.protectedApiService.editDoctorInfo(doctorId,data);
    } catch (error) {
      throw error;
    }
  }

  deleteDoctorInfo = (doctorId:String): Promise<any> => {
    try {
      return this.protectedApiService.deleteDoctorInfo(doctorId);
    } catch (error) {
      throw error;
    }
  }
}

export default DoctorService;
