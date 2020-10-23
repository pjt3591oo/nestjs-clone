import "reflect-metadata";
import express from 'express';

import {
  PATH_TYPE, METHOD_TYPE, CONTROLLER, CALLBACK_TYPE,
  BODY_TYPE, QUERY_TYPE, PARAMS_TYPE, REQUEST_TYPE, RESPONSE_TYPE, HEADERS_TYPE
} from './constant';

import { HTTP_METHOD, HTTP_METHODS } from './enum'

const app = express()

class NestFactory {
  static PORT = 4000;

  static create(appModules: any) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    appModules.map((module: any) => {
      let instance = new module();

      const endPoint = Reflect.getMetadata(CONTROLLER, module);
      HTTP_METHODS.forEach((http_method: string, idx: number) => {
        const subPaths = Reflect.getMetadata(PATH_TYPE, instance, http_method) || [];
        const handlers = Reflect.getMetadata(CALLBACK_TYPE, instance, http_method) || [];
        const handlerNames = Reflect.getMetadata(METHOD_TYPE, instance, http_method) || [];
        
        subPaths.forEach((subPath: string, idx: number) => {
          const path = `${endPoint}${subPath}`;
          
          let dataTypes = [BODY_TYPE, QUERY_TYPE, PARAMS_TYPE, REQUEST_TYPE, RESPONSE_TYPE, HEADERS_TYPE]
          let reqAndResObj: any = new Array(dataTypes.length)
          
          // TODO: 리팩토링 필요 => 영역별 파서를 어떻게 구분을 지을까......
          let body:[number, string] = Reflect.getMetadata(BODY_TYPE, instance, handlerNames[idx]) ;
          let query:[number, string] = Reflect.getMetadata(QUERY_TYPE, instance, handlerNames[idx]);
          let params:[number, string] = Reflect.getMetadata(PARAMS_TYPE, instance, handlerNames[idx]);
          let request:[number, string] = Reflect.getMetadata(REQUEST_TYPE, instance, handlerNames[idx]);
          let response:[number, string] = Reflect.getMetadata(RESPONSE_TYPE, instance, handlerNames[idx]);
          let headers:[number, string] = Reflect.getMetadata(HEADERS_TYPE, instance, handlerNames[idx]);
          
          if (body && body.length) reqAndResObj[body[0] || 0] = (req: any, res: any) => body[1] !== '' ? req.body[body[1]] : req.body
          if (query && query.length) reqAndResObj[query[0] || 0] = (req: any, res: any) => query[1] !== '' ? req.query[query[1]] : req.query
          if (params && params.length)   reqAndResObj[params[0]   || 0] = (req: any, res: any) => params[1]   !== '' ? req.params[params[1]] : req.params
          if (request && request.length)  reqAndResObj[request[0]  || 0] = (req: any, res: any) => request[1]  !== '' ? req[request[1]] : req
          if (response && response.length) reqAndResObj[response[0] || 0] = (req: any, res: any) => response[1] !== '' ? res[response[1]] :  res
          if (headers && headers.length)  reqAndResObj[headers[0]  || 0] = (req: any, res: any) => headers[1]  !== '' ? req.headers[headers[1]] : req.headers

          if (http_method === 'GET') app.get(path, (req: any, res: any) => {
            let rtn = handlers[idx].apply(this, reqAndResObj.map((i: any) => i(req, res)))
            return res.status(200).json(rtn)
          });
          else if (http_method === 'POST') app.post(path, (req: any, res:any) => {
            let rtn = handlers[idx].apply(this, reqAndResObj.map((i: any) => i(req, res)))
            return res.status(201).json(rtn)
          });
          else if (http_method === 'PUT') app.put(path, (req: any, res:any) => {
            let rtn = handlers[idx].apply(this, reqAndResObj.map((i: any) => i(req, res)))
            return res.status(201).json(rtn)
          });
          else if (http_method === 'DELETE') app.delete(path, (req: any, res:any) => {
            let rtn = handlers[idx].apply(this, reqAndResObj.map((i: any) => i(req, res)))
            return res.status(201).json(rtn)
          });
          
          console.log(`\x1b[32m 📗 ${new Date()}: [${http_method}] ${path}`)
        })
      })
      
    });
    app.listen(NestFactory.PORT, () => {
      console.log(`\x1b[34m 📘 ${new Date()}: App Start ${NestFactory.PORT}`)
      console.log(`\x1b[33m `)
    })
  }
}

export default NestFactory;