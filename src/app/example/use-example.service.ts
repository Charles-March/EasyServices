import { Injectable } from '@angular/core';
import { Service } from '../generic-service/service.service';
import { ExampleModel } from './models/model';
import { ExamplePageModel } from './models/page-model';
import { IDefaultPaginationPageOptions } from '../generic-service/default-page-options/default-page-options';

@Injectable()
export class UseExampleService extends Service<
  ExampleModel,
  ExamplePageModel,
  IDefaultPaginationPageOptions
> {}
