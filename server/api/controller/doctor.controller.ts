import "reflect-metadata";
import { Inject, Service } from 'typedi';
import DoctorService from '../services/doctor.service';
import { Request, Response, NextFunction } from 'express';
import { IDoctorDTO } from '../interfaces/IDoctor';
import HttpException from '../exceptions/http.exception';

@Service('doctor.controller')
class DoctorController {
  @Inject('doctor.service')
  doctorService: DoctorService;

  getInfo = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const doctorsData = await this.doctorService.getInfo();
      response.status(200).send(doctorsData);
    } catch (error) {
      console.log(error);
      next(new HttpException(error));
    }
  }

  addInfo = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const doctorDTO: [IDoctorDTO] = request.body;
      const doctorsData = await this.doctorService.addInfo(doctorDTO);
      response.status(200).send(doctorsData);
    } catch (error) {
      console.log(error);
      next(new HttpException(error));
    }
  }

  deleteOne = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const {id} = request.params;
      const deletedData = await this.doctorService.deleteOne(id);
      response.status(200).send(deletedData);
    } catch (error) {
      console.log(error);
      next(new HttpException(error));
    }
  }

  editOne = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const {id} = request.params;
      const doctorDTO: IDoctorDTO = request.body;
      const editedData = await this.doctorService.editOne(id,doctorDTO);
      response.status(200).send(editedData);
    } catch (error) {
      console.log(error);
      next(new HttpException(error));
    }
  }
}

export default DoctorController;
