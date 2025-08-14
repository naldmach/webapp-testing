import { test, expect } from '../../src/base/base-test';
import { PerformanceTesting } from '../../src/utils/performance-testing';

test.describe('Website Performance Tests', () => {
  let performanceTesting: PerformanceTesting;

  test.beforeEach(async ({ page }) => {
    performanceTesting = new PerformanceTesting(page);
  });

  test('Playwright.dev homepage performance', async () => {
    const analysis = await performanceTesting.analyzePagePerformance(
      'https://playwright.dev'
    );

    console.log('Performance Analysis:', {
      url: analysis.url,
      scores: analysis.scores,
      recommendations: analysis.recommendations
    });

    // Performance assertions
    expect(analysis.scores.overall).toBeGreaterThan(60); // Minimum 60% overall score
    expect(analysis.metrics.webVitals.firstContentfulPaint || 0).toBeLessThan(4000); // FCP < 4s
    expect(analysis.metrics.resources.totalResources).toBeLessThan(200); // < 200 resources

    // Log recommendations if performance is poor
    if (analysis.scores.overall < 80) {
      console.log('🔧 Performance Recommendations:', analysis.recommendations);
    }
  });

  test('Mobile performance test', async () => {
    const mobileResults = await performanceTesting.testMobilePerformance(
      'https://playwright.dev'
    );

    console.log('Mobile Performance:', {
      scores: mobileResults.scores,
      mobileSpecific: {
        touchTargets: mobileResults.mobileSpecific.touchTargetAnalysis,
        scrollPerformance: mobileResults.mobileSpecific.scrollPerformance
      }
    });

    // Mobile-specific assertions
    expect(mobileResults.scores.overall).toBeGreaterThan(50); // Mobile is typically slower
    expect(mobileResults.mobileSpecific.touchTargetAnalysis.compliance).toBeGreaterThan(80); // 80% touch target compliance
    expect(mobileResults.mobileSpecific.scrollPerformance.duration).toBeLessThan(5000); // Scroll test < 5s
  });

  test('Network throttling performance', async () => {
    // Test with slow 3G conditions
    const slowConditions = {
      downloadThroughput: 500 * 1024 / 8, // 500 Kbps
      uploadThroughput: 500 * 1024 / 8,   // 500 Kbps
      latency: 400 // 400ms latency
    };

    const throttledResults = await performanceTesting.testWithThrottling(
      'https://playwright.dev',
      slowConditions
    );

    console.log('Throttled Performance:', {
      conditions: throttledResults.networkConditions,
      scores: throttledResults.scores,
      loadTime: throttledResults.metrics.webVitals.loadComplete
    });

    // Throttled network assertions
    expect(throttledResults.scores.overall).toBeGreaterThan(30); // Lower expectations for slow network
    expect(throttledResults.metrics.webVitals.loadComplete || 0).toBeLessThan(15000); // < 15s on slow network
  });

  test('Load testing simulation', async () => {
    // Small load test (suitable for demo)
    const loadTestResults = await performanceTesting.loadTest(
      'https://playwright.dev', 
      {
        concurrent: 2,
        iterations: 3,
        delayBetweenBatches: 1000
      }
    );

    console.log('Load Test Results:', loadTestResults.summary);

    // Load test assertions
    expect(loadTestResults.summary.successRate).toBeGreaterThan(80); // 80% success rate
    expect(loadTestResults.summary.averageResponseTime).toBeLessThan(10000); // < 10s average
    expect(loadTestResults.errors.length).toBeLessThan(2); // < 2 errors
  });

  test('Performance comparison test', async () => {
    // Test multiple pages and compare
    const pages = [
      'https://playwright.dev',
      'https://playwright.dev/docs/intro'
    ];

    const results = [];
    
    for (const url of pages) {
      const analysis = await performanceTesting.analyzePagePerformance(url);
      results.push({
        url,
        score: analysis.scores.overall,
        loadTime: analysis.metrics.webVitals.loadComplete || 0,
        resources: analysis.metrics.resources.totalResources
      });
    }

    console.log('Performance Comparison:', results);

    // Comparative analysis
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    const avgLoadTime = results.reduce((sum, r) => sum + r.loadTime, 0) / results.length;

    expect(avgScore).toBeGreaterThan(60); // Average score > 60
    expect(avgLoadTime).toBeLessThan(5000); // Average load time < 5s

    // Log performance insights
    const bestPerforming = results.reduce((best, current) => 
      current.score > best.score ? current : best
    );
    const worstPerforming = results.reduce((worst, current) => 
      current.score < worst.score ? current : worst
    );

    console.log(`🏆 Best performing: ${bestPerforming.url} (${bestPerforming.score.toFixed(1)})`);
    console.log(`🐌 Needs improvement: ${worstPerforming.url} (${worstPerforming.score.toFixed(1)})`);
  });
});
