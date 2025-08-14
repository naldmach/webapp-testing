import { TestResult } from "@playwright/test/reporter";

export class AdvancedReporting {
  private results: TestResult[] = [];
  private startTime: Date = new Date();

  /**
   * Collect test metrics
   */
  addTestResult(result: TestResult): void {
    this.results.push(result);
  }

  /**
   * Generate performance metrics
   */
  generatePerformanceReport(): PerformanceMetrics {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(
      (r) => r.status === "passed"
    ).length;
    const failedTests = this.results.filter(
      (r) => r.status === "failed"
    ).length;
    const skippedTests = this.results.filter(
      (r) => r.status === "skipped"
    ).length;

    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    const averageDuration = totalTests > 0 ? totalDuration / totalTests : 0;

    return {
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        skipped: skippedTests,
        passRate: totalTests > 0 ? (passedTests / totalTests) * 100 : 0,
      },
      timing: {
        totalDuration,
        averageDuration,
        slowestTest: this.getSlowestTest(),
        fastestTest: this.getFastestTest(),
      },
      trends: this.calculateTrends(),
    };
  }

  /**
   * Generate flaky test report
   */
  generateFlakyTestReport(): FlakyTestReport {
    const flakyTests = this.results.filter((r) => r.retry > 0);

    return {
      totalFlaky: flakyTests.length,
      flakyRate:
        this.results.length > 0
          ? (flakyTests.length / this.results.length) * 100
          : 0,
      tests: flakyTests.map((test) => ({
        title: test.title,
        retries: test.retry,
        finalStatus: test.status,
        duration: test.duration,
      })),
    };
  }

  /**
   * Generate browser compatibility report
   */
  generateBrowserReport(): BrowserReport {
    const browserStats = new Map<
      string,
      { passed: number; failed: number; total: number }
    >();

    this.results.forEach((result) => {
      const project = result.project?.name || "unknown";
      const stats = browserStats.get(project) || {
        passed: 0,
        failed: 0,
        total: 0,
      };

      stats.total++;
      if (result.status === "passed") stats.passed++;
      if (result.status === "failed") stats.failed++;

      browserStats.set(project, stats);
    });

    return {
      browsers: Array.from(browserStats.entries()).map(([browser, stats]) => ({
        name: browser,
        ...stats,
        passRate: stats.total > 0 ? (stats.passed / stats.total) * 100 : 0,
      })),
    };
  }

  /**
   * Export to JSON for external tools
   */
  exportToJson(): string {
    const report = {
      metadata: {
        generatedAt: new Date().toISOString(),
        testStartTime: this.startTime.toISOString(),
        framework: "Playwright Test Framework",
        version: "1.0.0",
      },
      performance: this.generatePerformanceReport(),
      flaky: this.generateFlakyTestReport(),
      browsers: this.generateBrowserReport(),
      rawResults: this.results.map((r) => ({
        title: r.title,
        status: r.status,
        duration: r.duration,
        retry: r.retry,
        project: r.project?.name,
        error: r.error?.message,
      })),
    };

    return JSON.stringify(report, null, 2);
  }

  /**
   * Generate Slack notification payload
   */
  generateSlackNotification(): SlackNotification {
    const metrics = this.generatePerformanceReport();
    const flaky = this.generateFlakyTestReport();

    const color =
      metrics.summary.passRate >= 95
        ? "good"
        : metrics.summary.passRate >= 80
        ? "warning"
        : "danger";

    return {
      text: "Test Results Summary",
      attachments: [
        {
          color,
          title: "Playwright Test Framework Results",
          fields: [
            {
              title: "Pass Rate",
              value: `${metrics.summary.passRate.toFixed(1)}%`,
              short: true,
            },
            {
              title: "Total Tests",
              value: metrics.summary.total.toString(),
              short: true,
            },
            {
              title: "Failed Tests",
              value: metrics.summary.failed.toString(),
              short: true,
            },
            {
              title: "Flaky Tests",
              value: flaky.totalFlaky.toString(),
              short: true,
            },
          ],
          footer: "Playwright Test Framework",
          ts: Math.floor(Date.now() / 1000),
        },
      ],
    };
  }

  private getSlowestTest(): { title: string; duration: number } | null {
    if (this.results.length === 0) return null;

    const slowest = this.results.reduce((prev, current) =>
      prev.duration > current.duration ? prev : current
    );

    return { title: slowest.title, duration: slowest.duration };
  }

  private getFastestTest(): { title: string; duration: number } | null {
    if (this.results.length === 0) return null;

    const fastest = this.results.reduce((prev, current) =>
      prev.duration < current.duration ? prev : current
    );

    return { title: fastest.title, duration: fastest.duration };
  }

  private calculateTrends(): TrendData {
    // This would typically compare with historical data
    // For now, return basic trend indicators
    return {
      passRateTrend: "stable", // "improving" | "declining" | "stable"
      durationTrend: "stable",
      flakyTrend: "stable",
    };
  }
}

// Type definitions
interface PerformanceMetrics {
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    passRate: number;
  };
  timing: {
    totalDuration: number;
    averageDuration: number;
    slowestTest: { title: string; duration: number } | null;
    fastestTest: { title: string; duration: number } | null;
  };
  trends: TrendData;
}

interface FlakyTestReport {
  totalFlaky: number;
  flakyRate: number;
  tests: Array<{
    title: string;
    retries: number;
    finalStatus: string;
    duration: number;
  }>;
}

interface BrowserReport {
  browsers: Array<{
    name: string;
    passed: number;
    failed: number;
    total: number;
    passRate: number;
  }>;
}

interface TrendData {
  passRateTrend: "improving" | "declining" | "stable";
  durationTrend: "improving" | "declining" | "stable";
  flakyTrend: "improving" | "declining" | "stable";
}

interface SlackNotification {
  text: string;
  attachments: Array<{
    color: string;
    title: string;
    fields: Array<{
      title: string;
      value: string;
      short: boolean;
    }>;
    footer: string;
    ts: number;
  }>;
}

