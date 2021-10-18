import { Container, Inject, Service } from 'typedi';
import BaseRouter from './base.router';
import { IRoute } from '../interfaces/IRoute';
import DoctorController from '../controller/doctor.controller';
import { routes } from './constants'
import { HttpVerb } from './constants';
import { Router } from 'express';
import { CorsMiddleware, ErrorMiddleware } from '../middlewares';

const { DoctorRoutes } = routes;

@Service('doctor.router')
class DoctorRouter extends BaseRouter {
  constructor(public router: Router) {
    super(router);
  }

  get routes(): Array<IRoute> {
    const doctorController = Container.get<DoctorController>(DoctorController);
    const routes: Array<IRoute> = [];

    // Using middlewares
    routes.push({
      httpVerb: HttpVerb.USE,
      handlers: [CorsMiddleware]
    });

    routes.push({
      httpVerb: HttpVerb.POST,
      path: DoctorRoutes.ADD_INFO,
      handlers: [doctorController.addInfo]
    });

    routes.push({
      httpVerb: HttpVerb.GET,
      path: DoctorRoutes.GET_INFO,
      handlers: [doctorController.getInfo]
    });

    routes.push({
      httpVerb: HttpVerb.POST,
      path: DoctorRoutes.EDIT,
      handlers: [doctorController.editOne]
    });

    routes.push({
      httpVerb: HttpVerb.GET,
      path: DoctorRoutes.DELETE,
      handlers: [doctorController.deleteOne]
    });

    // Error Handler for Http Exceptions
    routes.push({
      httpVerb: HttpVerb.USE,
      handlers: [ErrorMiddleware],
    });

    return routes;
  }
}

export default DoctorRouter;
