import { HttpClient, HttpRequest } from '@angular/common/http';

export function createHttp(http: HttpClient, baseUrl: string = ''): HttpClient {
  const instance = {
    request(
      methodOrReq: HttpRequest<any> | string,
      url?: string,
      options?: any
    ): any {
      if (typeof methodOrReq === 'string') {
        return http.request(methodOrReq, baseUrl + url, options);
      }
      const req = methodOrReq.clone({
        url: baseUrl + methodOrReq.url
      });

      return http.request(req);
    },

    options(url: string, options?: any): any {
      return http.options(baseUrl + url, options);
    },

    head(url: string, options?: any): any {
      return http.head(baseUrl + url, options);
    },

    jsonp(url: string, callbackParam: string): any {
      return http.jsonp(baseUrl + url, callbackParam);
    },

    get(url: string, options?: any): any {
      return http.get(baseUrl + url, options);
    },

    post(url: string, body: any, options?: any): any {
      return http.post(baseUrl + url, body, options);
    },

    put(url: string, body: any, options?: any): any {
      return http.put(baseUrl + url, body, options);
    },

    delete(url: string, options?: any): any {
      return http.delete(baseUrl + url, options);
    },

    patch(url: string, body: any, options?: any): any {
      return http.patch(baseUrl + url, body, options);
    }
  };
  return instance as HttpClient;
}
