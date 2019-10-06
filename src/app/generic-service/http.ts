import { HttpClient, HttpRequest } from '@angular/common/http';

export interface ICustomHttpClient {
  request(
    methodOrReq: HttpRequest<any> | string,
    url?: string,
    options?: any
  ): any;
  options(url: string, options?: any): any;
  head(url: string, options?: any): any;
  jsonp(url: string, callbackParam: string): any;
  get(url: string, options?: any): any;
  post(url: string, body: any, options?: any): any;
  put(url: string, body: any, options?: any): any;
  delete(url: string, options?: any): any;
  patch(url: string, body: any, options?: any): any;
}

export class CustomHttpClient implements ICustomHttpClient {
  constructor(private http: HttpClient, private baseUrl: string = '') {}

  request(
    methodOrReq: HttpRequest<any> | string,
    url?: string,
    options?: any
  ): any {
    if (typeof methodOrReq === 'string') {
      return this.http.request(methodOrReq, this.baseUrl + url, options);
    }
    const req = methodOrReq.clone({
      url: this.baseUrl + methodOrReq.url
    });

    return this.http.request(req);
  }

  options(url: string, options?: any): any {
    return this.http.options(this.baseUrl + url, options);
  }

  head(url: string, options?: any): any {
    return this.http.head(this.baseUrl + url, options);
  }

  jsonp(url: string, callbackParam: string): any {
    return this.http.jsonp(this.baseUrl + url, callbackParam);
  }

  get(url: string, options?: any): any {
    return this.http.get(this.baseUrl + url, options);
  }

  post(url: string, body: any, options?: any): any {
    return this.http.post(this.baseUrl + url, body, options);
  }

  put(url: string, body: any, options?: any): any {
    return this.http.put(this.baseUrl + url, body, options);
  }

  delete(url: string, options?: any): any {
    return this.http.delete(this.baseUrl + url, options);
  }

  patch(url: string, body: any, options?: any): any {
    return this.http.patch(this.baseUrl + url, body, options);
  }
}

export function createHttp(http: HttpClient, baseUrl: string = '') {
  return new CustomHttpClient(http, baseUrl);
}
