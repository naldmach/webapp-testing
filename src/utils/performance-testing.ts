import { Page } from "@playwright/test";

export class PerformanceTesting {
  constructor(private page: Page) {}

  /**
   * Comprehensive page performance analysis
   */
  async analyzePagePerformance(url: string): Promise<PerformanceAnalysis> {
    await this.page.goto(url);

    // Wait for page to be fully loaded
    await this.page.waitForLoadState("networkidle");

    // Get Web Vitals and performance metrics
    const metrics = await this.page.evaluate(() => {
      return new Promise<PerformanceMetrics>((resolve) => {
        // Web Vitals
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals: any = {};

          entries.forEach((entry) => {
            if (entry.entryType === "navigation") {
              const nav = entry as PerformanceNavigationTiming;
              vitals.domContentLoaded =
                nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart;
              vitals.loadComplete = nav.loadEventEnd - nav.loadEventStart;
              vitals.firstByte = nav.responseStart - nav.requestStart;
            }

            if (entry.name === "first-contentful-paint") {
              vitals.firstContentfulPaint = entry.startTime;
            }

            if (entry.name === "largest-contentful-paint") {
              vitals.largestContentfulPaint = entry.startTime;
            }
          });

          // Resource timing
          const resources = performance.getEntriesByType("resource");
          const resourceMetrics = {
            totalResources: resources.length,
            totalSize: 0,
            slowestResource: { name: "", duration: 0 },
            resourceTypes: {} as Record<string, number>,
          };

          resources.forEach((resource: any) => {
            const duration = resource.responseEnd - resource.requestStart;
            if (duration > resourceMetrics.slowestResource.duration) {
              resourceMetrics.slowestResource = {
                name: resource.name,
                duration,
              };
            }

            // Count resource types
            const type = resource.initiatorType || "other";
            resourceMetrics.resourceTypes[type] =
              (resourceMetrics.resourceTypes[type] || 0) + 1;

            // Estimate size (if available)
            if (resource.transferSize) {
              resourceMetrics.totalSize += resource.transferSize;
            }
          });

          resolve({
            webVitals: vitals,
            resources: resourceMetrics,
            memory: (performance as any).memory
              ? {
                  usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
                  totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
                  jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
                }
              : null,
          });
        });

        observer.observe({
          entryTypes: ["navigation", "paint", "largest-contentful-paint"],
        });

        // Fallback timeout
        setTimeout(() => {
          observer.disconnect();
          resolve({
            webVitals: {},
            resources: {
              totalResources: 0,
              totalSize: 0,
              slowestResource: { name: "", duration: 0 },
              resourceTypes: {},
            },
            memory: null,
          });
        }, 5000);
      });
    });

    // Lighthouse-style scoring
    const scores = this.calculatePerformanceScores(metrics);

    return {
      url,
      timestamp: new Date().toISOString(),
      metrics,
      scores,
      recommendations: this.generateRecommendations(metrics, scores),
    };
  }

  /**
   * Network throttling test
   */
  async testWithThrottling(
    url: string,
    conditions: NetworkConditions
  ): Promise<PerformanceAnalysis> {
    // Set network conditions
    const client = await this.page.context().newCDPSession(this.page);
    await client.send("Network.enable");
    await client.send("Network.emulateNetworkConditions", {
      offline: false,
      downloadThroughput: conditions.downloadThroughput,
      uploadThroughput: conditions.uploadThroughput,
      latency: conditions.latency,
    });

    const analysis = await this.analyzePagePerformance(url);

    // Reset network conditions
    await client.send("Network.emulateNetworkConditions", {
      offline: false,
      downloadThroughput: -1,
      uploadThroughput: -1,
      latency: 0,
    });

    return {
      ...analysis,
      networkConditions: conditions,
    };
  }

  /**
   * Load testing simulation
   */
  async loadTest(
    url: string,
    options: LoadTestOptions
  ): Promise<LoadTestResults> {
    const results: PerformanceAnalysis[] = [];
    const errors: string[] = [];

    console.log(
      `Starting load test: ${options.concurrent} concurrent users, ${options.iterations} iterations each`
    );

    for (let batch = 0; batch < options.iterations; batch++) {
      const promises: Promise<PerformanceAnalysis>[] = [];

      // Create concurrent requests
      for (let i = 0; i < options.concurrent; i++) {
        const promise = this.analyzePagePerformance(url).catch((error) => {
          errors.push(`Batch ${batch}, User ${i}: ${error.message}`);
          return null;
        });
        promises.push(promise as Promise<PerformanceAnalysis>);
      }

      const batchResults = await Promise.all(promises);
      results.push(...batchResults.filter((r) => r !== null));

      // Wait between batches
      if (batch < options.iterations - 1 && options.delayBetweenBatches) {
        await this.page.waitForTimeout(options.delayBetweenBatches);
      }
    }

    return this.analyzeLoadTestResults(results, errors);
  }

  /**
   * Mobile performance testing
   */
  async testMobilePerformance(url: string): Promise<MobilePerformanceResults> {
    // Set mobile viewport and user agent
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15"
    );

    // Throttle network to simulate mobile conditions
    const mobileConditions: NetworkConditions = {
      downloadThroughput: (1.5 * 1024 * 1024) / 8, // 1.5 Mbps
      uploadThroughput: (750 * 1024) / 8, // 750 Kbps
      latency: 150, // 150ms latency
    };

    const analysis = await this.testWithThrottling(url, mobileConditions);

    return {
      ...analysis,
      mobileSpecific: {
        viewportSize: { width: 375, height: 667 },
        touchTargetAnalysis: await this.analyzeTouchTargets(),
        scrollPerformance: await this.testScrollPerformance(),
      },
    };
  }

  private calculatePerformanceScores(
    metrics: PerformanceMetrics
  ): PerformanceScores {
    const scores: PerformanceScores = {
      overall: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      loadTime: 0,
      resourceEfficiency: 0,
    };

    // FCP scoring (0-100)
    if (metrics.webVitals.firstContentfulPaint) {
      if (metrics.webVitals.firstContentfulPaint <= 1800)
        scores.firstContentfulPaint = 100;
      else if (metrics.webVitals.firstContentfulPaint <= 3000)
        scores.firstContentfulPaint = 75;
      else if (metrics.webVitals.firstContentfulPaint <= 4200)
        scores.firstContentfulPaint = 50;
      else scores.firstContentfulPaint = 25;
    }

    // LCP scoring
    if (metrics.webVitals.largestContentfulPaint) {
      if (metrics.webVitals.largestContentfulPaint <= 2500)
        scores.largestContentfulPaint = 100;
      else if (metrics.webVitals.largestContentfulPaint <= 4000)
        scores.largestContentfulPaint = 75;
      else scores.largestContentfulPaint = 25;
    }

    // Load time scoring
    if (metrics.webVitals.loadComplete) {
      if (metrics.webVitals.loadComplete <= 2000) scores.loadTime = 100;
      else if (metrics.webVitals.loadComplete <= 4000) scores.loadTime = 75;
      else if (metrics.webVitals.loadComplete <= 6000) scores.loadTime = 50;
      else scores.loadTime = 25;
    }

    // Resource efficiency
    if (metrics.resources.totalResources <= 50) scores.resourceEfficiency = 100;
    else if (metrics.resources.totalResources <= 100)
      scores.resourceEfficiency = 75;
    else if (metrics.resources.totalResources <= 150)
      scores.resourceEfficiency = 50;
    else scores.resourceEfficiency = 25;

    // Calculate overall score
    const validScores = Object.values(scores).filter((s) => s > 0);
    scores.overall =
      validScores.length > 0
        ? validScores.reduce((sum, score) => sum + score, 0) /
          validScores.length
        : 0;

    return scores;
  }

  private generateRecommendations(
    metrics: PerformanceMetrics,
    scores: PerformanceScores
  ): string[] {
    const recommendations: string[] = [];

    if (scores.firstContentfulPaint < 75) {
      recommendations.push(
        "Optimize First Contentful Paint by reducing render-blocking resources"
      );
    }

    if (scores.largestContentfulPaint < 75) {
      recommendations.push(
        "Improve Largest Contentful Paint by optimizing main content loading"
      );
    }

    if (metrics.resources.totalResources > 100) {
      recommendations.push(
        `Reduce number of resources (currently ${metrics.resources.totalResources})`
      );
    }

    if (metrics.resources.totalSize > 2 * 1024 * 1024) {
      // 2MB
      recommendations.push(
        "Optimize resource sizes - total transfer size is high"
      );
    }

    if (metrics.webVitals.firstByte > 600) {
      recommendations.push("Improve server response time (TTFB)");
    }

    return recommendations;
  }

  private async analyzeTouchTargets(): Promise<TouchTargetAnalysis> {
    return this.page.evaluate(() => {
      const elements = document.querySelectorAll(
        "button, a, input, select, textarea"
      );
      const smallTargets: string[] = [];
      const totalTargets = elements.length;

      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
          smallTargets.push(`Element ${index}: ${rect.width}x${rect.height}`);
        }
      });

      return {
        totalTargets,
        smallTargets: smallTargets.length,
        smallTargetDetails: smallTargets,
        compliance: ((totalTargets - smallTargets.length) / totalTargets) * 100,
      };
    });
  }

  private async testScrollPerformance(): Promise<ScrollPerformanceMetrics> {
    const startTime = Date.now();

    // Perform scroll test
    await this.page.evaluate(() => {
      return new Promise<void>((resolve) => {
        let scrollTop = 0;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollStep = 100;

        const scroll = () => {
          scrollTop += scrollStep;
          window.scrollTo(0, scrollTop);

          if (scrollTop >= maxScroll) {
            resolve();
          } else {
            requestAnimationFrame(scroll);
          }
        };

        scroll();
      });
    });

    const endTime = Date.now();

    return {
      duration: endTime - startTime,
      smooth: true, // Could be enhanced with frame rate detection
      jankScore: 0, // Could be calculated based on frame drops
    };
  }

  private analyzeLoadTestResults(
    results: PerformanceAnalysis[],
    errors: string[]
  ): LoadTestResults {
    const validResults = results.filter((r) => r !== null);

    if (validResults.length === 0) {
      return {
        summary: {
          totalRequests: results.length,
          successfulRequests: 0,
          failedRequests: errors.length,
          successRate: 0,
          averageResponseTime: 0,
          minResponseTime: 0,
          maxResponseTime: 0,
        },
        errors,
        recommendations: [
          "All requests failed - check server capacity and configuration",
        ],
      };
    }

    const responseTimes = validResults.map(
      (r) => r.metrics.webVitals.loadComplete || 0
    );
    const avgResponseTime =
      responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;

    return {
      summary: {
        totalRequests: results.length,
        successfulRequests: validResults.length,
        failedRequests: errors.length,
        successRate: (validResults.length / results.length) * 100,
        averageResponseTime: avgResponseTime,
        minResponseTime: Math.min(...responseTimes),
        maxResponseTime: Math.max(...responseTimes),
      },
      errors,
      recommendations: this.generateLoadTestRecommendations(
        validResults,
        errors
      ),
    };
  }

  private generateLoadTestRecommendations(
    results: PerformanceAnalysis[],
    errors: string[]
  ): string[] {
    const recommendations: string[] = [];

    const avgLoad =
      results.reduce(
        (sum, r) => sum + (r.metrics.webVitals.loadComplete || 0),
        0
      ) / results.length;

    if (avgLoad > 5000) {
      recommendations.push(
        "High average response time under load - consider server scaling"
      );
    }

    if (errors.length > results.length * 0.1) {
      recommendations.push(
        "High error rate - check server stability and capacity"
      );
    }

    if (results.length < 10) {
      recommendations.push(
        "Consider running more iterations for better statistical significance"
      );
    }

    return recommendations;
  }
}

// Type definitions
interface PerformanceMetrics {
  webVitals: {
    firstContentfulPaint?: number;
    largestContentfulPaint?: number;
    domContentLoaded?: number;
    loadComplete?: number;
    firstByte?: number;
  };
  resources: {
    totalResources: number;
    totalSize: number;
    slowestResource: { name: string; duration: number };
    resourceTypes: Record<string, number>;
  };
  memory: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null;
}

interface PerformanceScores {
  overall: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  loadTime: number;
  resourceEfficiency: number;
}

interface PerformanceAnalysis {
  url: string;
  timestamp: string;
  metrics: PerformanceMetrics;
  scores: PerformanceScores;
  recommendations: string[];
  networkConditions?: NetworkConditions;
}

interface NetworkConditions {
  downloadThroughput: number;
  uploadThroughput: number;
  latency: number;
}

interface LoadTestOptions {
  concurrent: number;
  iterations: number;
  delayBetweenBatches?: number;
}

interface LoadTestResults {
  summary: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    successRate: number;
    averageResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
  };
  errors: string[];
  recommendations: string[];
}

interface TouchTargetAnalysis {
  totalTargets: number;
  smallTargets: number;
  smallTargetDetails: string[];
  compliance: number;
}

interface ScrollPerformanceMetrics {
  duration: number;
  smooth: boolean;
  jankScore: number;
}

interface MobilePerformanceResults extends PerformanceAnalysis {
  mobileSpecific: {
    viewportSize: { width: number; height: number };
    touchTargetAnalysis: TouchTargetAnalysis;
    scrollPerformance: ScrollPerformanceMetrics;
  };
}

