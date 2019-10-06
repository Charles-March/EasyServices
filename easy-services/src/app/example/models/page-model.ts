import { ExampleModel } from './model';
import { IMysqlDefaultPage } from 'src/app/generic-service/default-page/default-page';
import { Entity, Type } from '@decahedron/entity';

export class ExamplePageModel extends Entity
  implements IMysqlDefaultPage<ExampleModel> {
  current_page: number;
  per_page: number;
  from: number;
  to: number;
  total: number;

  @Type(ExampleModel)
  data: ExampleModel[];
}
