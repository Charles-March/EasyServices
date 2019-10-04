import { Injectable } from '@angular/core';
import { Repository } from './repository';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { first, map } from 'rxjs/operators';

/**
 * A generic service class designed for basic crud actions
 * @generic T: Entity Type
 * @generic Po: Page Options for list operation (cf changeListOptions)
 * @generic Pm: Page Model returned by list operation (cf list)
 */
export abstract class Service<T, Po, Pm> {
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
   * @param forceRepository OPTIONAL A new repository, override default repository
   */
  initRepository(
    url: string,
    entityType: any,
    forceRepository: Repository<T, Po, Pm> = null
  ) {
    if (forceRepository) {
      this.repository = forceRepository;
    } else {
      this.repository = new Repository<T, Po, Pm>(
        url,
        entityType,
        this.httpClient
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
    });
    return obs;
  }

  /**
   * Create an entity with an entity or a formData
   * @param entity the entity to build
   * @param toSelected OPTIONAL Push the created entity into selectedEntity observer
   */
  create(entity: T | FormData, toSelected: boolean = false) {
    const obs = this.repository.create(entity);
    if (toSelected) {
      obs.pipe(first()).subscribe(createdEntity => {
        this._selectedEntity.next(createdEntity);
      });
    }
    return obs;
  }

  /**
   * Find one entity by id
   * @param toSelected OPTIONAL Push the created entity in the selectedEntity pipe
   */
  find(id: string, toSelected: boolean = false) {
    const obs = this.repository.findOne(id);
    if (toSelected) {
      obs.pipe(first()).subscribe(createdEntity => {
        this._selectedEntity.next(createdEntity);
      });
    }
    return obs;
  }

  /**
   * Update an entity by id. Can be updated by a Partial of entity's class or a formData
   * @param toSelected OPTIONAL Push the created entity in the selectedEntity pipe
   */
  update(
    id: string,
    updatedEntity: Partial<T> | FormData,
    toSelected: boolean = false
  ) {
    const obs = this.repository.update(id, updatedEntity);
    if (toSelected) {
      obs.pipe(first()).subscribe(createdEntity => {
        this._selectedEntity.next(createdEntity);
      });
    }
    return obs;
  }
  /**
   * Update an entity by id using a PATCH http call. Can be updated by a Partial of entity's class or a formData
   * @param toSelected OPTIONAL Push the created entity in the selectedEntity pipe
   */
  patch(
    id: string,
    updatedEntity: Partial<T> | FormData,
    toSelected: boolean = false
  ) {
    const obs = this.repository.patch(id, updatedEntity);
    if (toSelected) {
      obs.pipe(first()).subscribe(createdEntity => {
        this._selectedEntity.next(createdEntity);
      });
    }
    return obs;
  }

  /**
   * Delete an entity by id
   */
  delete(id: string) {
    this.repository.delete(id);
  }
}
