import { Injectable } from '@angular/core';
import { stringify } from 'qs';
import { createHttp } from './http';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { EntityBuilder } from '@decahedron/entity';

@Injectable()
export class Repository<T, Po, Pm> {
  private _http: HttpClient;
  private TClass: any;

  constructor(
    private readonly url,
    private readonly http: HttpClient,
    entityType: any
  ) {
    this._http = createHttp(http, this.url);
    this.TClass = entityType;
  }

  public find(options: Partial<Po> = {}) {
    const query = stringify(options, {
      arrayFormat: 'brackets',
      skipNulls: true,
      addQueryPrefix: true,
      encodeValuesOnly: true
    });

    return this._http
      .get<Pm>(`/${query}`)
      .pipe(map((page): Pm => EntityBuilder.buildOne(this.TClass, page)));
  }

  public findOne(id: string) {
    return this._http
      .get(`/${id}`)
      .pipe(map((data): T => EntityBuilder.buildOne(this.TClass, data)));
  }

  public create(entity: T | FormData) {
    return this._http
      .post(`/`, entity)
      .pipe(map((data): T => EntityBuilder.buildOne(this.TClass, data)));
  }

  public update(id: string, entity: Partial<T> | FormData) {
    return this._http
      .put(`/${id}`, entity)
      .pipe(map((data): T => EntityBuilder.buildOne(this.TClass, data)));
  }

  public patch(id: string, entity: Partial<T> | FormData) {
    return this._http
      .patch(`/${id}`, entity)
      .pipe(map((data): T => EntityBuilder.buildOne(this.TClass, data)));
  }

  public delete(id: string) {
    return this.http.delete<void>(`/${id}`);
  }
}
