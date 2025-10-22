export type MintResponse = {
  code: number;
  message: string;
  status: number;
  timestamp: string;
  data: {
    tokenId: string;
    publishedHash: string;
    originalHash: string;
    tokenURI: string;
    transactionHash: string;
    qrUrl: string;
    qrImage: string;
  };
};

export type ApiError = {
  code: number;
  message: string;
  status: number;
  timestamp: string;
  errors?: Array<{ field?: string; message: string; value?: unknown }>;
};

export async function mintCertificateApi(baseUrl: string, owner: string, file: string, signal?: AbortSignal): Promise<MintResponse> {
  const formData = new FormData();
  formData.append('owner', owner);
  formData.append('file', file);

  const res = await fetch(`${baseUrl}/certificate/mint`, {
    method: 'POST',
    body: formData,
    signal,
  });

  const text = await res.text();
  let json: unknown;
  try { json = text ? JSON.parse(text) : {}; } catch { throw new Error('Invalid JSON response'); }

  if (!res.ok) {
    const err = json as ApiError;
    throw new Error(err?.message || `HTTP ${res.status}`);
  }
  
  return json as MintResponse;
}


