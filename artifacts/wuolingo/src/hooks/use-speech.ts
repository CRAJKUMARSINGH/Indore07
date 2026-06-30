import { useCallback } from "react";

export function useSpeech() {
  const speak = useCallback((text: string, lang = "hi-IN") => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 0.85;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  }, []);

  const cancel = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return { speak, cancel };
}
