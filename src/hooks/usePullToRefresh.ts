import { useEffect } from 'react';

/**
 * Hook that implements pull-to-refresh functionality
 * @param onRefresh - Function to call when refresh is triggered
 */
export const usePullToRefresh = (onRefresh: () => void) => {
  useEffect(() => {
    let startY = 0;
    let isRefreshing = false;
    const threshold = 150; // Pull distance required to trigger refresh

    const handleTouchStart = (e: TouchEvent) => {
      // Only enable pull-to-refresh when at the top of the page
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isRefreshing || window.scrollY > 0) return;
      
      const currentY = e.touches[0].clientY;
      const pullDistance = currentY - startY;
      
      // Only proceed if pulling down
      if (pullDistance > 0) {
        // Prevent default to disable native scrolling
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isRefreshing || window.scrollY > 0) return;
      
      const currentY = e.changedTouches[0].clientY;
      const pullDistance = currentY - startY;
      
      // If pulled down far enough, trigger refresh
      if (pullDistance > threshold) {
        isRefreshing = true;
        onRefresh();
        setTimeout(() => {
          isRefreshing = false;
        }, 1000);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onRefresh]);
}; 