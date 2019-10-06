import { Entity } from '@decahedron/entity';

export interface IDefaultMysqlPageOptions {
  page?: number;
  per_page?: number;
  search?: string;
  search_by?: string[];
  sort_by?: string;
  sort_direction?: 'ASC' | 'DESC';
  fields?: string[];

  created_before?: Date;
  created_after?: Date;
  updated_before?: Date;
  updated_after?: Date;
}

export class DefaultMysqlPageOptions extends Entity
  implements IDefaultMysqlPageOptions {
  page: number = null;
  per_page: number = null;
  search: string = null;
  search_by: string[] = [];
  sort_by: string = null;
  sort_direction: 'ASC' | 'DESC' = null;
  fields: string[] = [];

  created_before: Date = null;
  created_after: Date = null;
  updated_before: Date = null;
  updated_after: Date = null;
}
