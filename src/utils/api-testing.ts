import { APIRequestContext, expect } from '@playwright/test';

export class ApiTesting {
  constructor(private request: APIRequestContext) {}

  /**
   * Perform GET request with validation
   */
  async get(
    endpoint: string,
    options?: {
      headers?: Record<string, string>;
      params?: Record<string, string>;
      expectedStatus?: number;
    }
  ): Promise<any> {
    const url = this.buildUrl(endpoint, options?.params);

    const response = await this.request.get(url, {
      headers: options?.headers,
    });

    if (options?.expectedStatus) {
      expect(response.status()).toBe(options.expectedStatus);
    }

    return this.handleResponse(response);
  }

  /**
   * Perform POST request with validation
   */
  async post(
    endpoint: string,
    data?: any,
    options?: {
      headers?: Record<string, string>;
      expectedStatus?: number;
    }
  ): Promise<any> {
    const response = await this.request.post(endpoint, {
      data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (options?.expectedStatus) {
      expect(response.status()).toBe(options.expectedStatus);
    }

    return this.handleResponse(response);
  }

  /**
   * Perform PUT request with validation
   */
  async put(
    endpoint: string,
    data?: any,
    options?: {
      headers?: Record<string, string>;
      expectedStatus?: number;
    }
  ): Promise<any> {
    const response = await this.request.put(endpoint, {
      data,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (options?.expectedStatus) {
      expect(response.status()).toBe(options.expectedStatus);
    }

    return this.handleResponse(response);
  }

  /**
   * Perform DELETE request with validation
   */
  async delete(
    endpoint: string,
    options?: {
      headers?: Record<string, string>;
      expectedStatus?: number;
    }
  ): Promise<any> {
    const response = await this.request.delete(endpoint, {
      headers: options?.headers,
    });

    if (options?.expectedStatus) {
      expect(response.status()).toBe(options.expectedStatus);
    }

    return this.handleResponse(response);
  }

  /**
   * Validate response schema
   */
  async validateSchema(responseData: any, expectedSchema: any): Promise<void> {
    // Basic schema validation - in a real implementation, you might use a library like Joi or Yup
    for (const [key, expectedType] of Object.entries(expectedSchema)) {
      expect(responseData).toHaveProperty(key);

      if (typeof expectedType === 'string') {
        expect(typeof responseData[key]).toBe(expectedType);
      } else if (Array.isArray(expectedType)) {
        expect(Array.isArray(responseData[key])).toBeTruthy();
      } else if (typeof expectedType === 'object') {
        expect(typeof responseData[key]).toBe('object');
        await this.validateSchema(responseData[key], expectedType);
      }
    }
  }

  /**
   * Test API performance
   */
  async testPerformance(
    endpoint: string,
    options?: {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      data?: any;
      maxResponseTime?: number;
      iterations?: number;
    }
  ): Promise<{ averageTime: number; minTime: number; maxTime: number }> {
    const iterations = options?.iterations || 5;
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();

      switch (options?.method || 'GET') {
      case 'GET':
        await this.get(endpoint);
        break;
      case 'POST':
        await this.post(endpoint, options?.data);
        break;
      case 'PUT':
        await this.put(endpoint, options?.data);
        break;
      case 'DELETE':
        await this.delete(endpoint);
        break;
      }

      const endTime = Date.now();
      times.push(endTime - startTime);
    }

    const averageTime =
      times.reduce((sum, time) => sum + time, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);

    if (options?.maxResponseTime && averageTime > options.maxResponseTime) {
      throw new Error(
        `Average response time ${averageTime}ms exceeds maximum ${options.maxResponseTime}ms`
      );
    }

    return { averageTime, minTime, maxTime };
  }

  /**
   * Test API with authentication
   */
  async authenticatedRequest(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    token: string,
    data?: any
  ): Promise<any> {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    switch (method) {
    case 'GET':
      return this.get(endpoint, { headers });
    case 'POST':
      return this.post(endpoint, data, { headers });
    case 'PUT':
      return this.put(endpoint, data, { headers });
    case 'DELETE':
      return this.delete(endpoint, { headers });
    }
  }

  /**
   * Batch API requests
   */
  async batchRequests(
    requests: Array<{
      method: 'GET' | 'POST' | 'PUT' | 'DELETE';
      endpoint: string;
      data?: any;
      headers?: Record<string, string>;
    }>
  ): Promise<any[]> {
    const promises = requests.map((req) => {
      switch (req.method) {
      case 'GET':
        return this.get(req.endpoint, { headers: req.headers });
      case 'POST':
        return this.post(req.endpoint, req.data, { headers: req.headers });
      case 'PUT':
        return this.put(req.endpoint, req.data, { headers: req.headers });
      case 'DELETE':
        return this.delete(req.endpoint, { headers: req.headers });
      }
    });

    return Promise.all(promises);
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    if (!params) return endpoint;

    const url = new URL(endpoint, 'http://localhost');
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    return url.pathname + url.search;
  }

  /**
   * Handle response and extract data
   */
  private async handleResponse(response: any): Promise<any> {
    const contentType = response.headers()['content-type'] || '';

    if (contentType.includes('application/json')) {
      return response.json();
    } else if (contentType.includes('text/')) {
      return response.text();
    } else {
      return response.body();
    }
  }
}
