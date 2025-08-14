import { Reporter, TestCase, TestResult, FullResult } from "@playwright/test/reporter";
import { AdvancedReporting } from "../utils/advanced-reporting";
import fs from "fs";
import path from "path";

export class AdvancedReporter implements Reporter {
  private advancedReporting: AdvancedReporting;
  private startTime: Date;

  constructor() {
    this.advancedReporting = new AdvancedReporting();
    this.startTime = new Date();
  }

  onBegin(config: any, suite: any) {
    console.log(`🚀 Starting ${suite.allTests().length} tests`);
    this.startTime = new Date();
  }

  onTestEnd(test: TestCase, result: TestResult) {
    // Add result to our advanced reporting
    this.advancedReporting.addTestResult(result);

    // Log test completion with status
    const status = this.getStatusIcon(result.status);
    const duration = `${result.duration}ms`;
    console.log(`${status} ${test.title} (${duration})`);
  }

  async onEnd(result: FullResult) {
    const endTime = new Date();
    const totalDuration = endTime.getTime() - this.startTime.getTime();

    console.log(`\n📊 Test Execution Complete`);
    console.log(`⏱️  Total Duration: ${totalDuration}ms`);

    // Generate comprehensive reports
    await this.generateReports();
    
    // Generate notifications if configured
    await this.sendNotifications();

    console.log(`\n📋 Reports generated in: test-results/advanced-reports/`);
  }

  private async generateReports() {
    const reportsDir = path.join(process.cwd(), "test-results", "advanced-reports");
    
    // Ensure directory exists
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Generate JSON report
    const jsonReport = this.advancedReporting.exportToJson();
    fs.writeFileSync(
      path.join(reportsDir, "advanced-test-report.json"),
      jsonReport
    );

    // Generate performance report
    const performanceMetrics = this.advancedReporting.generatePerformanceReport();
    fs.writeFileSync(
      path.join(reportsDir, "performance-metrics.json"),
      JSON.stringify(performanceMetrics, null, 2)
    );

    // Generate flaky test report
    const flakyReport = this.advancedReporting.generateFlakyTestReport();
    fs.writeFileSync(
      path.join(reportsDir, "flaky-tests.json"),
      JSON.stringify(flakyReport, null, 2)
    );

    // Generate browser compatibility report
    const browserReport = this.advancedReporting.generateBrowserReport();
    fs.writeFileSync(
      path.join(reportsDir, "browser-compatibility.json"),
      JSON.stringify(browserReport, null, 2)
    );

    // Generate HTML summary report
    await this.generateHtmlSummary(performanceMetrics, flakyReport, browserReport);

    console.log(`✅ Advanced reports generated:`);
    console.log(`   📄 JSON Report: advanced-test-report.json`);
    console.log(`   📊 Performance: performance-metrics.json`);
    console.log(`   🔄 Flaky Tests: flaky-tests.json`);
    console.log(`   🌐 Browser Compatibility: browser-compatibility.json`);
    console.log(`   📋 HTML Summary: test-summary.html`);
  }

  private async generateHtmlSummary(
    performance: any,
    flaky: any,
    browser: any
  ) {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Advanced Test Report</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f5f5f5; 
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 8px; 
            padding: 30px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
        }
        .header { 
            text-align: center; 
            margin-bottom: 40px; 
            padding-bottom: 20px; 
            border-bottom: 2px solid #e0e0e0; 
        }
        .metric-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 20px; 
            margin-bottom: 40px; 
        }
        .metric-card { 
            background: #f8f9fa; 
            border-radius: 8px; 
            padding: 20px; 
            text-align: center; 
            border-left: 4px solid #007bff; 
        }
        .metric-value { 
            font-size: 2em; 
            font-weight: bold; 
            color: #007bff; 
        }
        .metric-label { 
            font-size: 0.9em; 
            color: #666; 
            margin-top: 5px; 
        }
        .section { 
            margin-bottom: 30px; 
        }
        .section h2 { 
            color: #333; 
            border-bottom: 1px solid #e0e0e0; 
            padding-bottom: 10px; 
        }
        .pass-rate { 
            background: linear-gradient(45deg, #28a745, #20c997); 
            color: white; 
        }
        .failed-tests { 
            background: linear-gradient(45deg, #dc3545, #fd7e14); 
            color: white; 
        }
        .flaky-tests { 
            background: linear-gradient(45deg, #ffc107, #fd7e14); 
            color: white; 
        }
        .total-tests { 
            background: linear-gradient(45deg, #6f42c1, #007bff); 
            color: white; 
        }
        .browser-list { 
            list-style: none; 
            padding: 0; 
        }
        .browser-item { 
            background: #f8f9fa; 
            margin: 10px 0; 
            padding: 15px; 
            border-radius: 5px; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
        }
        .browser-name { 
            font-weight: bold; 
        }
        .browser-stats { 
            font-size: 0.9em; 
            color: #666; 
        }
        .timestamp { 
            text-align: center; 
            color: #999; 
            font-size: 0.9em; 
            margin-top: 30px; 
        }
        .recommendations {
            background: #e7f3ff;
            border: 1px solid #b3d9ff;
            border-radius: 5px;
            padding: 15px;
            margin: 15px 0;
        }
        .recommendations h3 {
            margin-top: 0;
            color: #0066cc;
        }
        .recommendations ul {
            margin-bottom: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Advanced Test Report</h1>
            <p>Comprehensive testing analysis and insights</p>
        </div>

        <div class="metric-grid">
            <div class="metric-card pass-rate">
                <div class="metric-value">${performance.summary.passRate.toFixed(1)}%</div>
                <div class="metric-label">Pass Rate</div>
            </div>
            <div class="metric-card total-tests">
                <div class="metric-value">${performance.summary.total}</div>
                <div class="metric-label">Total Tests</div>
            </div>
            <div class="metric-card failed-tests">
                <div class="metric-value">${performance.summary.failed}</div>
                <div class="metric-label">Failed Tests</div>
            </div>
            <div class="metric-card flaky-tests">
                <div class="metric-value">${flaky.totalFlaky}</div>
                <div class="metric-label">Flaky Tests</div>
            </div>
        </div>

        <div class="section">
            <h2>⏱️ Performance Metrics</h2>
            <p><strong>Total Duration:</strong> ${performance.timing.totalDuration}ms</p>
            <p><strong>Average Duration:</strong> ${performance.timing.averageDuration.toFixed(0)}ms</p>
            ${performance.timing.slowestTest ? `
            <p><strong>Slowest Test:</strong> ${performance.timing.slowestTest.title} (${performance.timing.slowestTest.duration}ms)</p>
            ` : ''}
            ${performance.timing.fastestTest ? `
            <p><strong>Fastest Test:</strong> ${performance.timing.fastestTest.title} (${performance.timing.fastestTest.duration}ms)</p>
            ` : ''}
        </div>

        <div class="section">
            <h2>🌐 Browser Compatibility</h2>
            <ul class="browser-list">
                ${browser.browsers.map((b: any) => `
                <li class="browser-item">
                    <span class="browser-name">${b.name}</span>
                    <span class="browser-stats">
                        ${b.passed}/${b.total} passed (${b.passRate.toFixed(1)}%)
                    </span>
                </li>
                `).join('')}
            </ul>
        </div>

        ${flaky.totalFlaky > 0 ? `
        <div class="section">
            <h2>🔄 Flaky Tests Analysis</h2>
            <p><strong>Flaky Rate:</strong> ${flaky.flakyRate.toFixed(1)}%</p>
            <div class="recommendations">
                <h3>Recommendations:</h3>
                <ul>
                    <li>Review flaky tests for timing issues</li>
                    <li>Add proper wait conditions</li>
                    <li>Check for race conditions</li>
                    <li>Consider test environment stability</li>
                </ul>
            </div>
        </div>
        ` : ''}

        <div class="timestamp">
            Report generated on ${new Date().toLocaleString()}
        </div>
    </div>
</body>
</html>
    `;

    const reportsDir = path.join(process.cwd(), "test-results", "advanced-reports");
    fs.writeFileSync(path.join(reportsDir, "test-summary.html"), htmlContent);
  }

  private async sendNotifications() {
    // Check if Slack webhook is configured
    const slackWebhook = process.env.SLACK_WEBHOOK_URL;
    
    if (slackWebhook) {
      try {
        const notification = this.advancedReporting.generateSlackNotification();
        
        const response = await fetch(slackWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notification)
        });

        if (response.ok) {
          console.log(`📱 Slack notification sent successfully`);
        } else {
          console.log(`⚠️  Failed to send Slack notification: ${response.statusText}`);
        }
      } catch (error) {
        console.log(`⚠️  Error sending Slack notification: ${error}`);
      }
    }
  }

  private getStatusIcon(status: string): string {
    switch (status) {
      case 'passed': return '✅';
      case 'failed': return '❌';
      case 'skipped': return '⏭️';
      case 'timedOut': return '⏰';
      default: return '❓';
    }
  }
}

export default AdvancedReporter;
