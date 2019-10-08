import { Entity } from '@decahedron/entity';

export interface IDefaultPaginationPageOptions {
  page?: number;
  limit?: number;
}

export interface IDefaultAppendPageOptions {
  offset?: string | number;
  limit?: number;
}
