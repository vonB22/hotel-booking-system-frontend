import { useEffect } from 'react';

interface WebVital {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id?: string;
}

/**
 * useWebVitals Hook
 * Monitors Core Web Vitals and other performance metrics
 * 
 * @param onReport - Callback to handle reported vitals
 */
export function useWebVitals(onReport?: (metric: WebVital) => void) {
  useEffect(() => {
    // Largest Contentful Paint (LCP)
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const metric: WebVital = {
          name: 'LCP',
          value: entry.startTime,
          rating: entry.startTime < 2500 ? 'good' : entry.startTime < 4000 ? 'needs-improvement' : 'poor',
        };
        onReport?.(metric);
        
        // Only report the largest
        break;
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // LCP not supported
    }

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          const metric: WebVital = {
            name: 'CLS',
            value: clsValue,
            rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor',
          };
          onReport?.(metric);
        }
      }
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // CLS not supported
    }

    // First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const metric: WebVital = {
          name: 'FCP',
          value: entry.startTime,
          rating: entry.startTime < 1800 ? 'good' : entry.startTime < 3000 ? 'needs-improvement' : 'poor',
        };
        onReport?.(metric);
      }
    });

    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      // FCP not supported
    }

    // Navigation timing
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const metric: WebVital = {
          name: 'TTI',
          value: navigation.loadEventEnd - navigation.fetchStart,
          rating: (navigation.loadEventEnd - navigation.fetchStart) < 3800 ? 'good' : 'needs-improvement',
        };
        onReport?.(metric);
      }
    });

    return () => {
      observer.disconnect();
      clsObserver.disconnect();
      fcpObserver.disconnect();
    };
  }, [onReport]);
}

/**
 * Report Web Vitals to external service (e.g., Google Analytics, LogRocket)
 */
export function reportWebVitals(metric: WebVital) {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`${metric.name}: ${metric.value.toFixed(2)}ms - ${metric.rating}`);
  }

  // Send to analytics service (if gtag is available)
  try {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.value),
        event_category: 'web_vital',
        event_label: metric.id || '',
        non_interaction: true,
      });
    }
  } catch (e) {
    // gtag not available
  }
}
