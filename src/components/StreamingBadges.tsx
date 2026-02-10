/**
 * StreamingBadges Component
 *
 * Displays streaming provider logos and availability information
 */

'use client';

import { StreamingData } from '@/lib/types';
import { getProviderLogoUrl } from '@/lib/tmdb';

interface StreamingBadgesProps {
  streaming: StreamingData | null;
  compact?: boolean;
}

export default function StreamingBadges({
  streaming,
  compact = false,
}: StreamingBadgesProps) {
  if (!streaming) {
    return (
      <div className="text-xs text-gray-500 italic">
        Not available in Spain
      </div>
    );
  }

  const { providers } = streaming;
  const hasAnyProviders =
    (providers.flatrate && providers.flatrate.length > 0) ||
    (providers.rent && providers.rent.length > 0) ||
    (providers.buy && providers.buy.length > 0);

  if (!hasAnyProviders) {
    return (
      <div className="text-xs text-gray-500 italic">
        Not available in Spain
      </div>
    );
  }

  return (
    <div className={`space-y-${compact ? '1' : '2'}`}>
      {/* Streaming (flatrate) */}
      {providers.flatrate && providers.flatrate.length > 0 && (
        <div>
          {!compact && (
            <p className="text-xs font-medium text-gray-700 mb-1">Stream</p>
          )}
          <div className="flex flex-wrap gap-2">
            {providers.flatrate.map((provider) => (
              <div
                key={provider.providerId}
                className="relative group"
                title={provider.providerName}
              >
                <img
                  src={getProviderLogoUrl(provider.logoPath, 'w45')}
                  alt={provider.providerName}
                  className={`${
                    compact ? 'w-6 h-6' : 'w-10 h-10'
                  } rounded-lg shadow-sm`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rent */}
      {providers.rent && providers.rent.length > 0 && !compact && (
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Rent</p>
          <div className="flex flex-wrap gap-2">
            {providers.rent.map((provider) => (
              <div
                key={provider.providerId}
                className="relative group"
                title={provider.providerName}
              >
                <img
                  src={getProviderLogoUrl(provider.logoPath, 'w45')}
                  alt={provider.providerName}
                  className="w-8 h-8 rounded-lg shadow-sm opacity-75"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buy */}
      {providers.buy && providers.buy.length > 0 && !compact && (
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Buy</p>
          <div className="flex flex-wrap gap-2">
            {providers.buy.map((provider) => (
              <div
                key={provider.providerId}
                className="relative group"
                title={provider.providerName}
              >
                <img
                  src={getProviderLogoUrl(provider.logoPath, 'w45')}
                  alt={provider.providerName}
                  className="w-8 h-8 rounded-lg shadow-sm opacity-75"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
