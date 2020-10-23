import {
  PATH_TYPE, METHOD_TYPE, CONTROLLER, CALLBACK_TYPE,
  QUERY_TYPE, BODY_TYPE, PARAMS_TYPE, REQUEST_TYPE, RESPONSE_TYPE, HEADERS_TYPE
} from '../constant';

import { HTTP_METHOD } from '../enum'

const httpMethodWrap = (target: any, httpMethod: string, path: string, methodName: string | symbol, descriptor: any) => {
  // TODO: 반복문 돌리기
  let paths = Reflect.getMetadata(PATH_TYPE, target, httpMethod) || [];
  paths.push(path);

  let callbacks = Reflect.getMetadata(CALLBACK_TYPE, target, httpMethod) || [];
  callbacks.push(descriptor.value);

  let methodNames = Reflect.getMetadata(METHOD_TYPE, target, httpMethod) || [];
  methodNames.push(methodName);

  Reflect.defineMetadata(PATH_TYPE, paths, target, httpMethod);
  Reflect.defineMetadata(CALLBACK_TYPE, callbacks, target, httpMethod);
  Reflect.defineMetadata(METHOD_TYPE, methodNames, target, httpMethod);
}

// const dataWrap = (target, )

// endpoint path
export function Controller(path: string) {
  return function <T extends { new(...args: any[]): {} }>(
    constructor: T
    ) {
      Reflect.defineMetadata(CONTROLLER, path, constructor);
    return class extends constructor {
    };
  }
}


// httpMethodWrap => subpath / method
export function Get(path: string="/") {
  return function (target: any, methodName: string | symbol, descriptor: any) {
    httpMethodWrap(target, HTTP_METHOD.GET, path, methodName, descriptor);
  }
}

// httpMethodWrap => subpath / method
export function Post(path: string="/") {
  return function (target: any, methodName: string | symbol, descriptor: any) {
    httpMethodWrap(target, HTTP_METHOD.POST, path, methodName, descriptor);
  }
}

// httpMethodWrap => subpath / method
export function Delete(path: string="/") {
  return function (target: any, methodName: string | symbol, descriptor: any) {
    httpMethodWrap(target, HTTP_METHOD.DELETE, path, methodName, descriptor);
  }
}

// httpMethodWrap => subpath / method
export function Put(path: string="/") {
  return function (target: any, methodName: string | symbol, descriptor: any) {
    httpMethodWrap(target, HTTP_METHOD.PUT, path, methodName, descriptor);
  }
}


// Symbol 타입의 경우 Symbol("")의 형태로 출력됨
export function Query(key: string = "") {
  return function (target: any, methodName: string | Symbol, paramIdx: number) {
    Reflect.defineMetadata(QUERY_TYPE, [paramIdx, key], target, methodName.toString());
  }
}
export function Body(key: string = "") {
  return function (target: any, methodName: string | Symbol, paramIdx: number) {
    Reflect.defineMetadata(BODY_TYPE, [paramIdx, key], target, methodName.toString());
  }
}
export function Params(key: string = "") {
  return function (target: any, methodName: string | Symbol, paramIdx: number) {
    Reflect.defineMetadata(PARAMS_TYPE, [paramIdx, key], target, methodName.toString());
  }
}
export function Request(key: string = "") {
  return function (target: any, methodName: string | Symbol, paramIdx: number) {
    Reflect.defineMetadata(REQUEST_TYPE, [paramIdx, key], target, methodName.toString());
  }
}
export function Response(key: string = "") {
  return function (target: any, methodName: string | Symbol, paramIdx: number) {
    Reflect.defineMetadata(RESPONSE_TYPE, [paramIdx, key], target, methodName.toString());
  }
}
export function Headers(key: string = "") {
  return function (target: any, methodName: string | Symbol, paramIdx: number) {
    Reflect.defineMetadata(HEADERS_TYPE, [paramIdx, key], target, methodName.toString());
  }
}
