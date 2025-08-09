'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { CampProvider } from "@campnetwork/origin/react";

export default function Providers({ children }: { children: React.ReactNode }) {
    console.log("NEXT_PUBLIC_CAMP_NETWORK_CLIENT_ID")
  const [queryClient] = useState(() => new QueryClient());
   if (!process.env.NEXT_PUBLIC_CAMP_NETWORK_CLIENT_ID) {
    console.log('NEXT_PUBLIC_CAMP_NETWORK_CLIENT_ID is  set');
      throw new Error('NEXT_PUBLIC_CAMP_NETWORK_CLIENT_ID environment variable is required');
    }

  return (
    <QueryClientProvider client={queryClient}>
      <CampProvider clientId={process.env.NEXT_PUBLIC_CAMP_NETWORK_CLIENT_ID!}>
        {children}
      </CampProvider>
    </QueryClientProvider>
  );
}