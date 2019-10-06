import { stringify } from 'qs';
import { createHttp, ICustomHttpClient } from './http';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { EntityBuilder } from '@decahedron/entity';

/**
 * Generic repository
 */
export class Repository<T, Po, Pm> {
  private _http: HttpClient | ICustomHttpClient;
  private TClass: any;
  private PClass: any;

  constructor(
    private readonly url,
    private readonly http: HttpClient,
    entityType: any,
    pageType: any
  ) {
    this._http = createHttp(http, this.url);
    this.TClass = entityType;
    this.PClass = pageType;
  }

  public find(options: Partial<Po> = {}) {
    const query = stringify(options, {
      arrayFormat: 'brackets',
      skipNulls: true,
      addQueryPrefix: true,
      encodeValuesOnly: true
    });

    return this._http.get(`/${query}`).pipe(
      map(
        (page): Pm => {
          return EntityBuilder.buildOne<Pm>(this.PClass, page);
        }
      )
    );
  }

  public findOne(id: string) {
    return this._http.get(`/${id}`).pipe(
      map(
        (data): T => {
          return EntityBuilder.buildOne<T>(this.TClass, data);
        }
      )
    );
  }

  public create(entity: T | FormData) {
    return this._http
      .post(`/`, entity)
      .pipe(map((data): T => EntityBuilder.buildOne<T>(this.TClass, data)));
  }

  public update(id: string, entity: Partial<T> | FormData) {
    return this._http
      .put(`/${id}`, entity)
      .pipe(map((data): T => EntityBuilder.buildOne<T>(this.TClass, data)));
  }

  public patch(id: string, entity: Partial<T> | FormData) {
    return this._http
      .patch(`/${id}`, entity)
      .pipe(map((data): T => EntityBuilder.buildOne<T>(this.TClass, data)));
  }

  public delete(id: string) {
    return this._http.delete(`/${id}`);
  }
}
