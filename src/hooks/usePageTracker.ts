import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export function usePageTracker() {
  const location = useLocation();

  useEffect(() => {
    // Use raw axios to avoid CSRF requirement for this fire-and-forget tracking call
    axios.post('/api/track-visit', { page: location.pathname }).catch(() => {});
  }, [location.pathname]);
}
