import { Injectable } from '@angular/core';
import { Repository } from './repository';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { IRequiredPage } from './default-page/default-page';

@Injectable()
/**
 * A generic service class designed for basic crud actions
 * @generic T: Entity Type
 * @generic Po: Page Options for list operation (cf changeListOptions)
 * @generic Pm: Page Model returned by list operation (cf list)
 */
export abstract class Service<
  T extends Object,
  Pm extends IRequiredPage<T>,
  Po
> {
  protected useCache = false;
  protected storedPage: Pm = null;

  protected idField = 'id';

  protected repository: Repository<T, Po, Pm>;
  protected entityType: any;

  protected findOptions: any = {};

  protected _entityPage$ = new BehaviorSubject<Pm>(null);
  public entityPage$ = this._entityPage$.asObservable();

  protected _selectedEntity = new BehaviorSubject<T>(null);
  public selectedEntity = this._selectedEntity.asObservable();

  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Initialize the repository
   * @param url base url for the entity
   * @param entityType class of the entity
   * @param pageType class of the page model
   * @param useCache if set to true, a copy of the page will be saved and updated on each modification (like a store)
   * @param idField DEFAULT: 'id', The T's id field which is unique (useless if you don't use cache)
   * @param forceRepository OPTIONAL A new repository, override default repository
   */
  initRepository(
    url: string,
    entityType: any,
    pageType: any,
    useCache: boolean,
    idField: string = 'id',
    forceRepository: Repository<T, Po, Pm> = null
  ) {
    this.useCache = useCache;
    this.idField = idField;
    if (forceRepository) {
      this.repository = forceRepository;
    } else {
      this.repository = new Repository<T, Po, Pm>(
        url,
        this.httpClient,
        entityType,
        pageType
      );
    }
  }

  /**
   * Change options that will be send with the list query as query params for filtering/sortinging
   * @param options see more example in default-page-options/*.ts
   */
  changeListOptions(options: any) {
    this.findOptions = options;
  }

  /**
   * List entities based on options stored and push the Pm into entityPage observer
   * @returns return an observable of entity page (Pm)
   */
  list() {
    const obs = this.repository.find(this.findOptions);
    obs.pipe(first()).subscribe(list => {
      this._entityPage$.next(list);
      if (this.useCache) {
        this.storedPage = list;
      }
    });
    return obs;
  }

  /**
   * Create an entity with an entity or a formData
   * @param entity the entity to build
   * @param reload OPTIONAL if set to true, call list() after the post ended
   * @param toSelected OPTIONAL Push the created entity into selectedEntity observer
   */
  create(entity: T | FormData, reload = false, toSelected: boolean = false) {
    const obs = this.repository.create(entity);
    obs.pipe(first()).subscribe(createdEntity => {
      if (toSelected) {
        this._selectedEntity.next(createdEntity);
      }
      if (reload) {
        this.list();
      } else if (this.useCache) {
        if (this.storedPage) {
          this.storedPage.data.push(createdEntity);
          this._entityPage$.next(this.storedPage);
        } else {
          this.storedPage = { data: [createdEntity] } as Pm;
        }
      }
    });
    return obs;
  }

  /**
   * Find one entity by id
   * @param toSelected OPTIONAL Push the created entity in the selectedEntity pipe
   */
  find(id: string, toSelected: boolean = false) {
    const obs = this.repository.findOne(id);
    obs.pipe(first()).subscribe(createdEntity => {
      if (toSelected) {
        this._selectedEntity.next(createdEntity);
      }
    });

    return obs;
  }

  /**
   * Update an entity by id. Can be updated by a Partial of entity's class or a formData
   * @param reload OPTIONAL if set to true, call list() after the post ended
   * @param toSelected OPTIONAL Push the created entity in the selectedEntity pipe
   */
  update(
    id: string,
    updatedEntity: Partial<T> | FormData,
    reload: boolean = false,
    toSelected: boolean = false
  ) {
    const obs = this.repository.update(id, updatedEntity);
    obs.pipe(first()).subscribe(returnedEntity => {
      if (toSelected) {
        this._selectedEntity.next(returnedEntity);
      }
      if (reload) {
        this.list();
      } else if (this.useCache) {
        this._updateOneEntityById(id, returnedEntity);
      }
    });

    return obs;
  }
  /**
   * Update an entity by id using a PATCH http call. Can be updated by a Partial of entity's class or a formData
   * @param toSelected OPTIONAL Push the created entity in the selectedEntity pipe
   * @param toSelected OPTIONAL Push the created entity in the selectedEntity pipe
   */
  patch(
    id: string,
    updatedEntity: Partial<T> | FormData,
    reload: boolean = false,
    toSelected: boolean = false
  ) {
    const obs = this.repository.patch(id, updatedEntity);
    obs.pipe(first()).subscribe(returnedEntity => {
      if (toSelected) {
        this._selectedEntity.next(returnedEntity);
      }
      if (reload) {
        this.list();
      } else if (this.useCache) {
        this._updateOneEntityById(id, returnedEntity);
      }
    });

    return obs;
  }

  /**
   * Delete an entity by id
   * @param reload OPTIONAL if set to true, call list() after the post ended
   */
  delete(id: string, reload: boolean = false) {
    const obs = this.repository.delete(id);
    obs.pipe(first()).subscribe(() => {
      if (reload) {
        this.list();
      }
      if (this.useCache) {
        this._deleteEntityById(id);
      }
    });
  }

  /**
   * Update a stored entity
   * @param id Id of the entity
   * @param updatedEntity entity with new values
   */
  protected _updateOneEntityById(id: string, updatedEntity: T) {
    if (
      this.storedPage &&
      this.storedPage.data &&
      this.storedPage.data.length > 0
    ) {
      const index = this.storedPage.data.findIndex(entity => {
        const keys = Object.keys(entity);
        if (keys.includes(this.idField)) {
          return entity[this.idField] === id;
        } else {
          throw new Error(
            'Easy Service : Impossible to find ID Field, maybe you missed the `idField` on initRepository()'
          );
        }
      });

      this.storedPage.data[index] = updatedEntity;
      this._entityPage$.next(this.storedPage);
    } else {
      this.storedPage.data = [updatedEntity];
    }
  }

  /**
   * Delete an entity in the stored page ()
   * @param id Id of the entity
   */
  protected _deleteEntityById(id: string) {
    if (
      this.storedPage &&
      this.storedPage.data &&
      this.storedPage.data.length > 0
    ) {
      const index = this.storedPage.data.findIndex(entity => {
        const keys = Object.keys(entity);
        if (keys.includes(this.idField)) {
          return entity[this.idField] === id;
        } else {
          throw new Error(
            'Easy Service : Impossible to find ID Field, maybe you missed the `idField` on initRepository()'
          );
        }
      });

      this.storedPage.data.splice(index, 1);
      this._entityPage$.next(this.storedPage);
    } else {
      console.warn(
        'Easy Service : Invalid state, delete called while stored page as no member'
      );
    }
  }
}
