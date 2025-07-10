import { useState, useEffect, useRef } from "react";

interface UseAIInterventionProps {
  triggerDelayMs?: number; // Default 5 seconds
  enabled?: boolean;
}

export function useAIIntervention({ 
  triggerDelayMs = 5000, 
  enabled = true 
}: UseAIInterventionProps = {}) {
  const [showIntervention, setShowIntervention] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    lastActivityRef.current = Date.now();
    
    if (enabled && !showIntervention) {
      timeoutRef.current = setTimeout(() => {
        setShowIntervention(true);
      }, triggerDelayMs);
    }
  };

  const dismissIntervention = () => {
    setShowIntervention(false);
    resetTimer();
  };

  // Track various user activities
  useEffect(() => {
    if (!enabled) return;

    const events = [
      'mousedown',
      'mousemove', 
      'keypress',
      'scroll',
      'touchstart',
      'touchmove',
      'click'
    ];

    const handleActivity = () => {
      if (!showIntervention) {
        resetTimer();
      }
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start initial timer
    resetTimer();

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [enabled, triggerDelayMs, showIntervention]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    showIntervention,
    dismissIntervention,
    resetTimer
  };
}