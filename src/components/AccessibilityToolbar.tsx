import { useState, useEffect } from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { setGlobalSpeechRate } from '@/hooks/useSpeech';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Accessibility,
  X,
  Type,
  Contrast,
  Volume2,
  RotateCcw,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { settings, setFontSize, toggleHighContrast, setSpeechRate, resetSettings } = useAccessibility();

  // Sync speech rate with global setting
  useEffect(() => {
    setGlobalSpeechRate(settings.speechRate);
  }, [settings.speechRate]);

  const fontSizeLabels = {
    normal: '100%',
    large: '125%',
    'x-large': '150%',
  };

  const cycleFontSize = () => {
    const sizes: Array<'normal' | 'large' | 'x-large'> = ['normal', 'large', 'x-large'];
    const currentIndex = sizes.indexOf(settings.fontSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    setFontSize(sizes[nextIndex]);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90"
        size="icon"
        aria-label="Open accessibility toolbar"
        title="Accessibility Options"
      >
        <Accessibility className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 z-50 bg-card border border-border rounded-2xl shadow-2xl transition-all duration-300",
        isMinimized ? "w-auto" : "w-80"
      )}
      role="toolbar"
      aria-label="Accessibility toolbar"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Accessibility className="h-5 w-5 text-primary" />
          {!isMinimized && <span className="font-semibold text-sm">Accessibility</span>}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? "Expand toolbar" : "Minimize toolbar"}
          >
            {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsOpen(false)}
            aria-label="Close accessibility toolbar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Controls */}
      {!isMinimized && (
        <div className="p-4 space-y-5">
          {/* Font Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Type className="h-4 w-4" />
                Font Size
              </label>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {fontSizeLabels[settings.fontSize]}
              </span>
            </div>
            <div className="flex gap-2">
              {(['normal', 'large', 'x-large'] as const).map((size) => (
                <Button
                  key={size}
                  variant={settings.fontSize === size ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => setFontSize(size)}
                  aria-pressed={settings.fontSize === size}
                >
                  {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                </Button>
              ))}
            </div>
          </div>

          {/* High Contrast */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Contrast className="h-4 w-4" />
              High Contrast
            </label>
            <Button
              variant={settings.highContrast ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={toggleHighContrast}
              aria-pressed={settings.highContrast}
            >
              {settings.highContrast ? '✓ Enabled' : 'Enable High Contrast'}
            </Button>
          </div>

          {/* Speech Rate */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Volume2 className="h-4 w-4" />
                Speech Rate
              </label>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {settings.speechRate.toFixed(1)}x
              </span>
            </div>
            <Slider
              value={[settings.speechRate]}
              onValueChange={([value]) => setSpeechRate(value)}
              min={0.5}
              max={1.5}
              step={0.1}
              className="w-full"
              aria-label="Speech rate"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Slower</span>
              <span>Faster</span>
            </div>
          </div>

          {/* Reset Button */}
          <Button
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={resetSettings}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
        </div>
      )}
    </div>
  );
}
