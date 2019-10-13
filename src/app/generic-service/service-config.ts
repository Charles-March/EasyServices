/**
 * ServiceConfig
 * * Config JSON pased to easyService to configure
 * * You can pass or a combinaison of (url, entityType, pageType) or forceRepository
 * @param url base url for the entity
 * @param entityType class of the entity
 * @param pageType class of the page model
 * @param minTime set a min time between list() calls (default: 0)
 * @param forceRepository A new repository, override default repository
 */
export interface ServiceConfig {
  forceRepository?: any;
  url?: string;
  pageType?: any;
  entityType?: any;
  minTime?: number;
}
