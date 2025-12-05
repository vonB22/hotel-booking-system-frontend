/**
 * Performance Monitoring Utilities
 * Track and report performance metrics across the application
 */

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private marks: Record<string, number> = {};

  /**
   * Start measuring performance for an operation
   */
  mark(name: string) {
    this.marks[name] = performance.now();
    if (import.meta.env.DEV) {
      console.log(`⏱️  Started: ${name}`);
    }
  }

  /**
   * End measuring and record the metric
   */
  measure(name: string, metadata?: Record<string, any>) {
    const startTime = this.marks[name];
    if (!startTime) {
      console.warn(`No start mark found for: ${name}`);
      return null;
    }

    const duration = performance.now() - startTime;
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    };

    this.metrics.push(metric);

    if (import.meta.env.DEV) {
      const color = duration < 100 ? '🟢' : duration < 500 ? '🟡' : '🔴';
      console.log(`${color} ${name}: ${duration.toFixed(2)}ms`);
    }

    return metric;
  }

  /**
   * Get all recorded metrics
   */
  getMetrics() {
    return this.metrics;
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics = [];
    this.marks = {};
  }

  /**
   * Get average duration for a metric name
   */
  getAverageDuration(name: string) {
    const relevantMetrics = this.metrics.filter(m => m.name === name);
    if (relevantMetrics.length === 0) return 0;
    const total = relevantMetrics.reduce((sum, m) => sum + m.duration, 0);
    return total / relevantMetrics.length;
  }

  /**
   * Get summary of all metrics
   */
  getSummary() {
    const summary: Record<string, any> = {};
    const uniqueNames = [...new Set(this.metrics.map(m => m.name))];

    for (const name of uniqueNames) {
      const relevantMetrics = this.metrics.filter(m => m.name === name);
      summary[name] = {
        count: relevantMetrics.length,
        total: relevantMetrics.reduce((sum, m) => sum + m.duration, 0),
        average: this.getAverageDuration(name),
        min: Math.min(...relevantMetrics.map(m => m.duration)),
        max: Math.max(...relevantMetrics.map(m => m.duration)),
      };
    }

    return summary;
  }

  /**
   * Export metrics as JSON
   */
  export() {
    return {
      metrics: this.metrics,
      summary: this.getSummary(),
      timestamp: new Date().toISOString(),
    };
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React Hook for performance monitoring
 */
export function usePerformanceMonitor(operationName: string) {
  return {
    start: () => performanceMonitor.mark(operationName),
    end: (metadata?: Record<string, any>) => performanceMonitor.measure(operationName, metadata),
  };
}

/**
 * Measure API call performance
 */
export function measureAPICall(name: string, duration: number) {
  performanceMonitor.getMetrics().push({
    name: `API_${name}`,
    duration,
    timestamp: Date.now(),
  });

  if (import.meta.env.DEV) {
    const color = duration < 500 ? '🟢' : duration < 1000 ? '🟡' : '🔴';
    console.log(`${color} API ${name}: ${duration.toFixed(2)}ms`);
  }
}
