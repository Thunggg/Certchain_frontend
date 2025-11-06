"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMintCreative } from "@/hooks/use-mint-creative";
import { useState } from "react";
import { useImageUpload } from "@/hooks/use-image-upload";
import { ImagePlus, X, Upload, Trash2, FileText } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const evmAddress = /^0x[0-9a-fA-F]{1,64}$/;
const allowedMime = ["application/pdf", "image/png", "image/jpeg"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const formSchema = z.object({
  title: z
    .string()
    .min(3, "Tiêu đề phải có ít nhất 3 ký tự")
    .max(100, "Tiêu đề không được vượt quá 100 ký tự"),
    
  description: z
    .string()
    .min(10, "Mô tả phải có ít nhất 10 ký tự")
    .max(500, "Mô tả không được vượt quá 500 ký tự"),
    
  ownerName: z
    .string()
    .min(3, "Tên chủ sở hữu phải có ít nhất 3 ký tự")
    .max(100, "Tên chủ sở hữu không được vượt quá 100 ký tự"),
    
  owner: z
    .string()
    .trim()
    .toLowerCase()
    .regex(evmAddress, "Địa chỉ ví không hợp lệ"),

  file: z
    .instanceof(File)
    .optional()
    .refine(
      (f) => !f || allowedMime.includes(f.type),
      "Chỉ cho phép PDF/PNG/JPG"
    )
    .refine(
      (f) => !f || f.size <= MAX_FILE_SIZE,
      "Kích thước tệp tối đa 10MB"
    ),
});

export default function MintCreative() {
  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      ownerName: "",
      owner: "",
      file: undefined,
    },
  });

  const { mutate, data, error, isPending } = useMintCreative();

  const {
    previewUrl,
    fileName,
    fileInputRef,
    handleThumbnailClick,
    handleFileChange,
    handleRemove,
    handleFileObject,
  } = useImageUpload();

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileObject(file);
      form.setValue("file", file as File, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  function onSubmit(values: z.input<typeof formSchema>) {
    try {
      // Gửi tất cả các trường mới thêm vào
      mutate(
        { 
          title: values.title,
          description: values.description,
          ownerName: values.ownerName,
          owner: values.owner, 
          file: values.file as File 
        },
        {
          onSuccess: () => {
            form.reset();
            form.setValue("file", undefined as unknown as File, {
              shouldValidate: true,
              shouldDirty: false,
            });
            handleRemove();
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen flex items-start md:items-center justify-center px-4 py-8 md:py-12">
      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Mint Creative NFT</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Creative File (PDF/PNG/JPG, ≤ 10MB)</FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(e) => {
                          handleFileChange(e);
                          const f = e.target.files?.[0];
                          form.setValue("file", f as File, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                      />

                      {!previewUrl && !field.value ? (
                        <div
                          onClick={handleThumbnailClick}
                          onDragOver={handleDragOver}
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={cn(
                            "flex h-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted",
                            isDragging && "border-primary/50 bg-primary/5",
                          )}
                        >
                          <div className="rounded-full bg-background p-3 shadow-sm">
                            <ImagePlus className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">Click to select</p>
                            <p className="text-xs text-muted-foreground">
                              or drag and drop file here
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="group relative h-64 overflow-hidden rounded-lg border">
                            {field.value && (field.value as File).type?.startsWith("image/") && previewUrl ? (
                              <>
                                <Image
                                  src={previewUrl}
                                  alt="Preview"
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  unoptimized
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={handleThumbnailClick}
                                    className="h-9 w-9 p-0"
                                    type="button"
                                  >
                                    <Upload className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      handleRemove();
                                      form.setValue("file", undefined as unknown as File, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                      });
                                    }}
                                    className="h-9 w-9 p-0"
                                    type="button"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </>
                            ) : field.value && (field.value as File).type === "application/pdf" && previewUrl ? (
                              <div className="h-full w-full relative">
                                <iframe
                                  src={previewUrl + "#toolbar=0"}
                                  className="h-full w-full"
                                  title="PDF Preview"
                                />
                                <div className="absolute top-2 right-2 flex gap-2 z-10">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={handleThumbnailClick}
                                    className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                                    type="button"
                                  >
                                    <Upload className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                      handleRemove();
                                      form.setValue("file", undefined as unknown as File, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                      });
                                    }}
                                    className="h-8 w-8 p-0"
                                    type="button"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <a 
                                  href={previewUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 z-10"
                                >
                                  Mở PDF
                                </a>
                              </div>
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-black/20">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <FileText className="h-5 w-5" />
                                  <span className="text-sm">PDF selected</span>
                                </div>
                              </div>
                            )}
                          </div>
                          {field.value && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="truncate">{(field.value as File).name}</span>
                              <button
                                onClick={() => {
                                  handleRemove();
                                  form.setValue("file", undefined as unknown as File, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  });
                                }}
                                className="ml-auto rounded-full p-1 hover:bg-muted"
                                type="button"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tiêu đề creative..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập mô tả chi tiết..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ownerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên chủ sở hữu</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tên chủ sở hữu..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner Wallet Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0x..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? "Đang xử lý..." : "Mint Creative NFT"}
              </Button>
            </div>
          </form>
        </Form>

        {data && (
          <div className="mt-8 p-4 border border-green-500/20 bg-green-500/10 rounded-lg">
            <h3 className="font-medium text-green-400 mb-2">Mint thành công!</h3>
            <div className="space-y-2 text-sm">
              <p><span className="opacity-70">Token ID:</span> {data.data.tokenId}</p>
              <p><span className="opacity-70">Transaction Hash:</span> {data.data.transactionHash}</p>
              <div className="mt-4">
                <p className="mb-2 opacity-70">QR Code:</p>
                {data.data.qrImage && (
                  <div className="flex justify-center">
                    <img 
                      src={data.data.qrImage} 
                      alt="Creative NFT QR Code" 
                      className="max-w-[200px] h-auto"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 border border-red-500/20 bg-red-500/10 rounded-lg">
            <h3 className="font-medium text-red-400 mb-2">Lỗi</h3>
            <p className="text-sm">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}