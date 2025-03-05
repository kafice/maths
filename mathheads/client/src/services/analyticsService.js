import { getAnalytics, logEvent } from 'firebase/analytics';

class AnalyticsService {
  constructor() {
    this.analytics = getAnalytics();
  }

  // Log test start event
  logTestStart(category, difficulty) {
    logEvent(this.analytics, 'test_started', {
      category,
      difficulty
    });
  }

  // Log test completion event
  logTestCompletion(category, difficulty, score) {
    logEvent(this.analytics, 'test_completed', {
      category,
      difficulty,
      score
    });
  }

  // Log user engagement
  logUserEngagement(action) {
    logEvent(this.analytics, 'user_engagement', { action });
  }
}

export default new AnalyticsService();
