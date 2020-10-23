import {
  Controller,
  Get, Post, Put, Delete,
  Body, Query, Request
} from '../derators';
import NestFactory from '../';

@Controller('/user')
class User {
  
  constructor() {
    
  }

  @Get()
  getDetail(@Query('a') query: any, @Request() a: any) {
    console.log(query);
    return "test1"
  }

  @Get('/user')
  getUser(req: any, res: any) {
    return "test2"
  }
  
  @Get('/users')
  getUsers(req: any, res: any) {
    return "test3"
  }
  @Post('/users')
  addUser(@Body("test") b:any) {
    console.log(b)
    return "test4"
  }
}

NestFactory.create([User]);