import { Entity } from '@decahedron/entity';

export interface IRequiredPage<T> {
  data: T[];
}

export interface IMysqlDefaultPage<T> extends IRequiredPage<T> {
  current_page: number;
  per_page: number;
  from: number;
  to: number;
  total: number;
  data: T[];
}

export abstract class DefaultPage<T> extends Entity {
  current_page: number = null;
  per_page: number = null;
  from: number = null;
  to: number = null;
  total: number = null;
  abstract data: T[];
}
