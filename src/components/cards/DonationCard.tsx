import { DonationListing, CATEGORIES } from '@/lib/supabase-types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SpeakButton } from '@/components/ui/speak-button';
import { MapPin, Clock, MessageCircle, Package, Gift } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DonationCardProps {
  listing: DonationListing;
  onContact?: (listing: DonationListing) => void;
  showActions?: boolean;
}

export function DonationCard({ listing, onContact, showActions = true }: DonationCardProps) {
  const category = CATEGORIES.find(c => c.value === listing.category);
  const profile = listing.profiles;

  // Generate accessible text for screen readers and TTS
  const getAccessibleText = () => {
    const parts = [
      `Donation: ${listing.title}.`,
      category ? `Category: ${category.label}.` : '',
      listing.description ? `Description: ${listing.description}.` : '',
      listing.location ? `Location: ${listing.location}.` : '',
      `Posted ${formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}.`,
      `Donated by ${profile?.username || 'User'}.`,
    ];
    return parts.filter(Boolean).join(' ');
  };

  return (
    <Card 
      className="overflow-hidden card-hover bg-card border-donation/20 hover:border-donation/40 group"
      role="article"
      aria-label={`Donation: ${listing.title}`}
    >
      {/* Type indicator banner for colorblind accessibility */}
      <div className="bg-donation/10 px-3 py-1.5 flex items-center gap-2 border-b border-donation/20">
        <Gift className="h-4 w-4 text-donation" aria-hidden="true" />
        <span className="text-xs font-semibold text-donation uppercase tracking-wide">Donation</span>
      </div>

      {listing.image_url && (
        <div className="aspect-[4/3] overflow-hidden bg-donation-light">
          <img
            src={listing.image_url}
            alt={`Image of ${listing.title}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      {!listing.image_url && (
        <div className="aspect-[4/3] flex items-center justify-center bg-donation-light" aria-hidden="true">
          <Package className="h-16 w-16 text-donation/40" />
        </div>
      )}
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-semibold text-lg line-clamp-1">{listing.title}</h3>
          <div className="flex items-center gap-1">
            <SpeakButton 
              text={getAccessibleText()} 
              className="opacity-70 hover:opacity-100"
              aria-label={`Read donation details for ${listing.title}`}
            />
            <Badge variant="secondary" className="shrink-0 bg-donation-light text-donation-foreground">
              <span aria-hidden="true">{category?.icon}</span> {category?.label}
            </Badge>
          </div>
        </div>
        
        {listing.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {listing.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {listing.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              <span>Location: {listing.location}</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            <span>Posted {formatDistanceToNow(new Date(listing.created_at), { addSuffix: true })}</span>
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={profile?.avatar_url || undefined} alt={`${profile?.username || 'User'}'s avatar`} />
            <AvatarFallback className="bg-donation/10 text-donation text-xs" aria-hidden="true">
              {profile?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Donated by {profile?.username || 'User'}</span>
        </div>
        
        {showActions && onContact && (
          <Button
            variant="donation-outline"
            size="sm"
            onClick={() => onContact(listing)}
            aria-label={`Contact ${profile?.username || 'donor'} about ${listing.title}`}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Contact
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
