import { Entity } from '@decahedron/entity';

export class ExampleModel extends Entity {
  public id?: string = null;
  constructor(public foo: string, public bar: string) {
    super();
  }
}
