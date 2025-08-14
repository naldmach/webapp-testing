// Simple API client helper for junior developers
// This makes API testing easier and more readable

/**
 * Simple API client wrapper around Playwright's request context
 * Provides common methods for API testing
 */
class ApiClient {
  constructor(request, baseURL = '') {
    this.request = request;
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Additional options
   * @returns {Promise<Response>}
   */
  async get(endpoint, options = {}) {
    const url = this.buildUrl(endpoint);
    
    const response = await this.request.get(url, {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options
    });
    
    return this.handleResponse(response);
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body data
   * @param {object} options - Additional options
   * @returns {Promise<Response>}
   */
  async post(endpoint, data = {}, options = {}) {
    const url = this.buildUrl(endpoint);
    
    const response = await this.request.post(url, {
      headers: { ...this.defaultHeaders, ...options.headers },
      data: data,
      ...options
    });
    
    return this.handleResponse(response);
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body data
   * @param {object} options - Additional options
   * @returns {Promise<Response>}
   */
  async put(endpoint, data = {}, options = {}) {
    const url = this.buildUrl(endpoint);
    
    const response = await this.request.put(url, {
      headers: { ...this.defaultHeaders, ...options.headers },
      data: data,
      ...options
    });
    
    return this.handleResponse(response);
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {object} options - Additional options
   * @returns {Promise<Response>}
   */
  async delete(endpoint, options = {}) {
    const url = this.buildUrl(endpoint);
    
    const response = await this.request.delete(url, {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options
    });
    
    return this.handleResponse(response);
  }

  /**
   * Set authorization token
   * @param {string} token - Bearer token
   */
  setAuthToken(token) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Clear authorization token
   */
  clearAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  /**
   * Build full URL from endpoint
   * @param {string} endpoint 
   * @returns {string}
   */
  buildUrl(endpoint) {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    return `${this.baseURL}${endpoint}`;
  }

  /**
   * Handle response and add helpful methods
   * @param {Response} response 
   * @returns {Promise<object>}
   */
  async handleResponse(response) {
    const responseData = {
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
      ok: response.ok()
    };

    // Try to parse JSON, fallback to text
    try {
      responseData.data = await response.json();
    } catch (error) {
      responseData.data = await response.text();
    }

    // Add convenience methods
    responseData.isSuccess = () => response.ok();
    responseData.isError = () => !response.ok();
    responseData.hasData = () => responseData.data !== null && responseData.data !== undefined;

    return responseData;
  }
}

module.exports = { ApiClient };
