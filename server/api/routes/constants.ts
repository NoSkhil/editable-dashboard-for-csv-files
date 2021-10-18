export enum HttpVerb {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
  USE = "USE",
}

export const routes = {
  DoctorRoutes: {
    ROOT: '/',
    GET_INFO: '/fetch/info',
    EDIT: '/edit/:id',
    DELETE: '/delete/:id',
    ADD_INFO: '/add/info',
  },
};
