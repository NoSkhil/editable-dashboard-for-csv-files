import { Service } from 'typedi';
import { DoctorModel } from '../../model/doctor.model';
import { ReturnModelType } from '@typegoose/typegoose';
import PropertyRequiredException from '../../exceptions/propertyRequired.exception';
import { IDoctorDTO } from '../../interfaces/IDoctor';

@Service('doctor.service')
class DoctorService {
  private doctorModel: ReturnModelType<typeof DoctorModel>;

  constructor() {
    this.doctorModel = DoctorModel;
  }

  async getInfo() {
    return this.doctorModel.find();
  }

  editOne = async (id: string, doctorDTO: IDoctorDTO) => {
    if (!id) throw new PropertyRequiredException("Doctor Id");
    return this.doctorModel.updateOne({ _id: id }, doctorDTO);
  }

  deleteOne = async (id: string) => {
    if (!id) throw new PropertyRequiredException("Doctor Id");
    return this.doctorModel.deleteOne({ _id: id });
  }

  addInfo = async (doctorDTO: [IDoctorDTO]) => {
    return this.doctorModel.create(doctorDTO);
  }
}

export default DoctorService;
