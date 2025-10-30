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

export async function mintCertificateApi(
  baseUrl: string,
  owner: string,
  file: File,
  recipientWallet?: string,
  issuerName?: string,
  certificateName?: string,
  description?: string,
  issueDate?: string,
  signal?: AbortSignal,
): Promise<MintResponse> {
  const formData = new FormData();
  formData.append('owner', owner);
  formData.append('file', file);
  if (recipientWallet) {
    formData.append('recipientWallet', recipientWallet);
  }
  if (issuerName) formData.append('issuerName', issuerName);
  if (certificateName) formData.append('certificateName', certificateName);
  if (description) formData.append('description', description);
  if (issueDate) formData.append('issueDate', issueDate);

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

export async function mintCreativeApi(
  baseUrl: string,
  owner: string,
  issuerName: string,
  file: File,
  title?: string,
  description?: string,
  signal?: AbortSignal,
): Promise<MintResponse> {
  const formData = new FormData();
  formData.append('owner', owner);
  formData.append('issuerName', issuerName);
  formData.append('file', file);
  if (title) formData.append('title', title);
  if (description) formData.append('description', description);

  const res = await fetch(`${baseUrl}/creative/mint`, {
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

export type VerifyByFileResponse = {
  code: number;
  message: string;
  status: number;
  timestamp: string;
  data: {
    tokenId: number;
    hash: string;
    typeHash: 'original' | 'published';
    tokenURI: string;
  };
};

export type VerifyByQueryResponse = {
  code: number;
  message: string;
  status: number;
  timestamp: string;
  data: {
    tokenId: number;
    contractAddress: string;
    chainId: number;
    owner: string;
    tokenURI: string;
    status: string;
  };
};

export async function verifyCertificateByFileApi(
  baseUrl: string,
  file: File,
  tokenId?: number,
  signal?: AbortSignal,
): Promise<VerifyByFileResponse> {
  const formData = new FormData();
  if (typeof tokenId === 'number') {
    formData.append('tokenId', String(tokenId));
  }
  formData.append('file', file);

  const res = await fetch(`${baseUrl}/certificate/verify`, {
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

  return json as VerifyByFileResponse;
}

export async function verifyCertificateByQueryApi(
  baseUrl: string,
  params: {
    tokenId: number;
    contractAddress: string;
    chainId: number;
    type?: 'sbt' | '4907';
    sig?: string;
  },
  signal?: AbortSignal,
): Promise<VerifyByQueryResponse> {
  const qs = new URLSearchParams({
    tokenId: String(params.tokenId),
    contractAddress: params.contractAddress,
    chainId: String(params.chainId),
  });
  if (params.type) qs.set('type', params.type);
  if (params.sig) qs.set('sig', params.sig);

  const res = await fetch(`${baseUrl}/certificate/verify?${qs.toString()}`, {
    method: 'GET',
    signal,
  });

  const text = await res.text();
  let json: unknown;
  try { json = text ? JSON.parse(text) : {}; } catch { throw new Error('Invalid JSON response'); }

  if (!res.ok) {
    const err = json as ApiError;
    throw new Error(err?.message || `HTTP ${res.status}`);
  }

  return json as VerifyByQueryResponse;
}


