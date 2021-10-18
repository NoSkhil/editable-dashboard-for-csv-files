import { getModelForClass, getName, prop, Ref } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class Doctor {
  @prop({required: true})
  public phoneNumber: number;

  @prop({required: true})
  public firstName: string;

  @prop({required: true})
  public lastName: string;

  @prop({required: true})
  public groupName: string;

  @prop({required: true})
  public addresses: [string];

  @prop({required: true})
  public city: string;

  @prop({required: true})
  public state: string;

  @prop({required: true})
  public zip: number;

  @prop({required: true})
  public county: string;

}

export const DoctorModel = getModelForClass(Doctor);
