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
import { useMintCertificate } from "@/hooks/useMintCertificate";
import { useState } from "react";
import { useImageUpload } from "@/components/use-image-upload"
import { ImagePlus, X, Upload, Trash2, FileText } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const starknetAddress = /^0x[0-9a-fA-F]{1,64}$/;
const allowedMime = ["application/pdf", "image/png", "image/jpeg"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// const MIN_DATE = new Date("2000-01-01");

const formSchema = z
  .object({
    certificateName: z
      .string()
      .trim()
      .min(3, "Tên chứng chỉ quá ngắn")
      .max(100, "Tên chứng chỉ quá dài")
      .refine((s) => /\S/.test(s), "Không được chỉ toàn khoảng trắng"),

    description: z
      .string()
      .trim()
      .min(10, "Mô tả quá ngắn")
      .max(500, "Mô tả quá dài"),

    issueDate: z.coerce
      .date()
      .min(new Date("2000-01-01"), "Ngày phát hành không hợp lệ")
      .refine((d) => d <= new Date(), "Ngày phát hành không được ở tương lai"),

    issuerName: z
      .string()
      .trim()
      .min(2, "Tên tổ chức quá ngắn")
      .max(100, "Tên tổ chức quá dài"),

    issuerWallet: z
      .string()
      .trim()
      .toLowerCase()
      .regex(starknetAddress, "Địa chỉ Starknet không hợp lệ"),

    recipientWallet: z
      .string()
      .trim()
      .toLowerCase()
      .regex(starknetAddress, "Địa chỉ Starknet không hợp lệ"),

    file: z
      .instanceof(File)
      .optional() // ✅ Cho phép undefined khi reset
      .refine(
        (f) => !f || allowedMime.includes(f.type),
        "Chỉ cho phép PDF/PNG/JPG"
      )
      .refine(
        (f) => !f || f.size <= MAX_FILE_SIZE,
        "Kích thước tệp tối đa 10MB"
      ),
  })
  .superRefine((data, ctx) => {
    if (data.issuerWallet === data.recipientWallet) {
      ctx.addIssue({
        code: "custom",
        message: "Ví người nhận phải khác ví người phát hành",
        path: ["recipientWallet"],
      });
    }
  });

export default function MintPage() {
  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      certificateName: "",
      description: "",
      issueDate: "2000-01-01", // input string; will be coerced to Date by schema
      issuerName: "",
      issuerWallet: "",
      recipientWallet: "",
      file: undefined,
    },
  });

  const { mutate, data, error, isPending } = useMintCertificate();

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
  // Removed unused watcher: fileValue
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
      // Use direct File handler from the hook
      handleFileObject(file);
      form.setValue("file", file as File, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  // 2. Define a submit handler.
  function onSubmit(values: z.input<typeof formSchema>) {
    try {
      mutate(
        { owner: values.issuerWallet, file: values.file as File},
        {
          onSuccess: () => {
            // Reset form fields to initial state
            form.reset();
            // Clear file value explicitly and preview
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
    <div className="min-h-[calc(100vh-var(--nav-h))] flex items-start md:items-center justify-center px-4 py-8 md:py-12">
      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl shadow-lg p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificate File (PDF/PNG/JPG, ≤ 10MB)</FormLabel>
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
                              <Image
                                src={previewUrl}
                                alt="Preview"
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                unoptimized
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-black/20">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <FileText className="h-5 w-5" />
                                  <span className="text-sm">PDF selected</span>
                                </div>
                              </div>
                            )}
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
              name="certificateName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificate Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={String(field.value ?? "")}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issuerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuer Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issuerWallet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuer Wallet</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recipientWallet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Wallet</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isPending} type="submit" className="w-full">
              {isPending ? "Đang xử lý..." : "Mint Certificate"}
            </Button>
            {isPending && <p className="text-sm text-gray-400">Minting...</p>}
            {error && <p className="text-sm text-red-400">{error.message}</p>}
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
                          alt="Certificate NFT QR Code" 
                          className="max-w-[200px] h-auto"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
