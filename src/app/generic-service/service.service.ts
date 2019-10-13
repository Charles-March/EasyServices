import { Injectable } from '@angular/core';
import { Repository } from './repository';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { IRequiredPage } from './default-page/default-page';
import {
  IDefaultAppendPageOptions,
  IDefaultPaginationPageOptions
} from './default-page-options/default-page-options';
import { ServiceConfig } from './service-config';

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
  Po extends IDefaultAppendPageOptions | IDefaultPaginationPageOptions
> {
  protected repository: Repository<T, Po, Pm>;
  protected entityType: any;

  protected waitingTime = 0;
  protected inwaiting = false;
  protected waitingObs: Observable<Pm> = null;
  protected waitingValue: Pm = null;

  protected _entityPage$ = new BehaviorSubject<Pm>(null);
  public entityPage$ = this._entityPage$.asObservable();

  protected _selectedEntity = new BehaviorSubject<T>(null);
  public selectedEntity = this._selectedEntity.asObservable();

  constructor(private readonly httpClient: HttpClient) {}

  protected _canList(): boolean {
    return !this.inwaiting;
  }

  /**
   * Initialize the repository
   * @param config Configuration for the service see service-config.ts for more informations.
   */
  initRepository(config: ServiceConfig): void {
    this.waitingTime = config.minTime;
    if (config.forceRepository) {
      this.repository = config.forceRepository;
    } else {
      if (!config.url) {
        console.warn('Easy service: `url` missing in the config passed');
      }
      if (!config.pageType) {
        console.warn('Easy service: `pageType` missing in the config passed');
      }
      if (!config.entityType) {
        console.warn('Easy service: `entityType` missing in the config passed');
      }
      this.repository = new Repository<T, Po, Pm>(
        config.url,
        this.httpClient,
        config.entityType,
        config.pageType
      );
    }
  }

  /**
   * List entities based on options stored and push the Pm into entityPage observer
   * @returns return an observable of entity page (Pm)
   */
  list(options: Po): Observable<Pm> {
    if (!this.waitingTime || this._canList()) {
      this.inwaiting = true;
      const obs = this.repository.find(options);
      if (this.waitingTime) {
        this.waitingValue = null;
        this.waitingObs = obs;
        timer(this.waitingTime)
          .pipe(first())
          .subscribe(() => {
            this.inwaiting = false;
          });
      }
      obs.pipe(first()).subscribe(list => {
        this._entityPage$.next(list);
        this.waitingValue = list;
      });
      return obs;
    } else {
      if (this.waitingValue) {
        return new BehaviorSubject(this.waitingValue).asObservable();
      } else {
        return this.waitingObs;
      }
    }
  }

  /**
   * Create an entity with an entity or a formData
   * @param entity the entity to build
   * @param toSelected OPTIONAL Push the created entity into selectedEntity observer
   */
  create(
    entity: T | FormData,
    toSelected: boolean = false,
    options: Po = null
  ): Observable<T> {
    const obs = this.repository.create(entity);
    obs.pipe(first()).subscribe(createdEntity => {
      if (toSelected) {
        this._selectedEntity.next(createdEntity);
      }
      if (options) {
        this.list(options);
      }
    });
    return obs;
  }

  /**
   * Find one entity by id
   * @param toSelected OPTIONAL Push the created entity in the selectedEntity pipe
   */
  find(id: string, toSelected: boolean = false): Observable<T> {
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
    toSelected: boolean = false,
    options: Po = null
  ): Observable<T> {
    const obs = this.repository.update(id, updatedEntity);
    obs.pipe(first()).subscribe(returnedEntity => {
      if (toSelected) {
        this._selectedEntity.next(returnedEntity);
      }
      if (options) {
        this.list(options);
      }
    });

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
  ): Observable<T> {
    const obs = this.repository.patch(id, updatedEntity);
    obs.pipe(first()).subscribe(returnedEntity => {
      if (toSelected) {
        this._selectedEntity.next(returnedEntity);
      }
    });

    return obs;
  }

  /**
   * Delete an entity by id
   */
  delete(id: string): void {
    const obs = this.repository.delete(id);
    obs.pipe(first()).subscribe(() => {});
  }
}
