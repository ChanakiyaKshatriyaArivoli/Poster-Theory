import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function usePageTracker() {
  const location = useLocation();

  useEffect(() => {
    // Fire-and-forget analytics ping — exempt from CSRF as it's a
    // non-sensitive write (page view counter) and validated server-side
    fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: location.pathname }),
    }).catch(() => {});
  }, [location.pathname]);
}
