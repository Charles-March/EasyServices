import { ExampleModel } from './model';
import { Entity, Type } from '@decahedron/entity';
import { IDefaultPaginationPageOptions } from 'src/app/generic-service/default-page-options/default-page-options';

export class ExamplePageModel extends Entity {
  @Type(ExampleModel)
  data: ExampleModel[];
}
