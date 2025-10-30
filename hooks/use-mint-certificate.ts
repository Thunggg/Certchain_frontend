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
    onSuccess: () => {
      toast.success("Minted successfully 🎉", {
        duration: 5000,
        position: "top-right",
      })
    },
    onError: (error) => {
      toast.error(error.message, {
        duration: 8000,
        position: "top-right",
      })
    },
  });
}


