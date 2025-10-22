import { useMutation } from '@tanstack/react-query';
import { mintCertificateApi } from '@/lib/api';
import { toast } from 'react-hot-toast';

type MintCreativeParams = {
  title: string;
  description: string;
  ownerName: string;
  owner: string;
  file: File;
};

export function useMintCreative() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  return useMutation({
    mutationFn: async ({ title, description, ownerName, owner, file }: MintCreativeParams) => {
      if (!title) {
        throw new Error('Vui lòng nhập tiêu đề');
      }
      
      if (!description) {
        throw new Error('Vui lòng nhập mô tả');
      }
      
      if (!ownerName) {
        throw new Error('Vui lòng nhập tên chủ sở hữu');
      }
      
      if (!file) {
        throw new Error('Vui lòng chọn file');
      }
      
      if (!owner) {
        throw new Error('Vui lòng nhập địa chỉ ví');
      }

      // Hiện tại API chỉ hỗ trợ owner và file, nhưng chúng ta có thể mở rộng sau này
      // Tạm thời chỉ gửi owner và file
      return await mintCertificateApi(baseUrl, owner, file);
    },
    onSuccess: (data) => {
      toast.success('Mint creative NFT thành công!');
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi mint creative NFT');
      throw error;
    },
  });
}