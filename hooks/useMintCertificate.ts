'use client';

import { useMutation } from '@tanstack/react-query';
import { mintCertificateApi, type MintResponse } from '@/lib/api';

type Vars = { baseUrl?: string; owner: string; file: string };

export function useMintCertificate(defaultBaseUrl = 'http://localhost:3000/api') {
  return useMutation<MintResponse, Error, Vars>({
    mutationFn: async ({ baseUrl = defaultBaseUrl, owner, file }) => {
      return await mintCertificateApi(baseUrl, owner, file);
    },
  });
}


