'use client';

import { useMutation } from '@tanstack/react-query';
import { mintCertificateApi, type MintResponse } from '@/lib/api';
import toast from 'react-hot-toast';

type Vars = { baseUrl?: string; owner: string; file: File };

export function useMintCertificate(defaultBaseUrl = 'http://localhost:3000/api') {
  return useMutation<MintResponse, Error, Vars>({
    mutationFn: async ({ baseUrl = defaultBaseUrl, owner, file }) => {
      return await mintCertificateApi(baseUrl, owner, file);
    },
    onSuccess: (data) => {
      toast.success("Minted successfully 🎉")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  });
}


