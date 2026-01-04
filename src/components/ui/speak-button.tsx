import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSpeech } from '@/hooks/useSpeech';
import { cn } from '@/lib/utils';

interface SpeakButtonProps {
  text: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  label?: string;
}

export function SpeakButton({ 
  text, 
  className, 
  size = 'icon',
  variant = 'ghost',
  label = 'Read aloud'
}: SpeakButtonProps) {
  const { speak, stop, isSpeaking, isSupported } = useSpeech();

  if (!isSupported) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn(
        'transition-colors',
        isSpeaking && 'text-primary bg-primary/10',
        className
      )}
      aria-label={isSpeaking ? 'Stop reading' : label}
      title={isSpeaking ? 'Stop reading' : label}
    >
      {isSpeaking ? (
        <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
      {size !== 'icon' && (
        <span className="ml-2">{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
      )}
    </Button>
  );
}
