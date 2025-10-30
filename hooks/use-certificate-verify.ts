"use client";

import { useMutation } from "@tanstack/react-query";
import {
  verifyCertificateByFileApi,
  verifyCertificateByQueryApi,
  type VerifyByFileResponse,
  type VerifyByQueryResponse,
} from "@/lib/api";
import toast from "react-hot-toast";

export type VerifyFileVars = { baseUrl?: string; file: File; tokenId?: number };
export type VerifyQueryVars = {
  baseUrl?: string;
  tokenId: number;
  contractAddress: string;
  chainId: number;
  type?: "sbt" | "4907";
  sig?: string;
};

export function useCertificateVerify(defaultBaseUrl = "http://localhost:3000/api") {
  const verifyFile = useMutation<VerifyByFileResponse, Error, VerifyFileVars>({
    mutationFn: async ({ baseUrl = defaultBaseUrl, file, tokenId }) => {
      return await verifyCertificateByFileApi(baseUrl, file, tokenId);
    },
    onSuccess: (data) => {
      const kind = data.data.typeHash === "published" ? "Published" : "Original";
      toast.success(`Verified (${kind}) ✓`);
    },
    onError: (error) => {
      toast.error(error.message || "Verify failed");
    },
  });

  const verifyQuery = useMutation<VerifyByQueryResponse, Error, VerifyQueryVars>({
    mutationFn: async ({ baseUrl = defaultBaseUrl, tokenId, contractAddress, chainId, type, sig }) => {
      return await verifyCertificateByQueryApi(baseUrl, { tokenId, contractAddress, chainId, type, sig });
    },
    onSuccess: () => {
      toast.success("Verified by query ✓");
    },
    onError: (error) => {
      toast.error(error.message || "Verify failed");
    },
  });

  const parseVerifyUrl = (url: string) => {
    try {
      const u = new URL(url);
      const tokenId = Number(u.searchParams.get("tokenId"));
      const contractAddress = u.searchParams.get("contractAddress") || u.searchParams.get("contract") || "";
      const chainId = Number(u.searchParams.get("chainId") || u.searchParams.get("chain"));
      const type = (u.searchParams.get("type") || undefined) as "sbt" | "4907" | undefined;
      const sig = u.searchParams.get("sig") || undefined;
      if (!tokenId || !contractAddress || !chainId) {
        throw new Error("Thiếu tham số tokenId/contractAddress/chainId trong URL");
      }
      return { tokenId, contractAddress, chainId, type, sig };
    } catch (e) {
      const err = e as Error;
      toast.error(err.message || "URL không hợp lệ");
      return null;
    }
  };

  return {
    verifyFile,
    verifyQuery,
    parseVerifyUrl,
  };
}