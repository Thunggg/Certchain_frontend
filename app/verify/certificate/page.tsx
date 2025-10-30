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
import { useState } from "react";
import { useImageUpload } from "@/hooks/use-image-upload";
import { ImagePlus, Upload, Trash2, QrCode, FileText, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useCertificateVerify } from "@/hooks/use-certificate-verify";

const allowedMime = ["application/pdf", "image/png", "image/jpeg"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const fileSchema = z.object({
  tokenId: z
    .string()
    .optional()
    .refine((v) => !v || (/^\d+$/.test(v) && Number(v) > 0), "Token ID phải là số nguyên dương"),
  file: z
    .instanceof(File, { message: "Vui lòng chọn file" })
    .refine((f) => allowedMime.includes(f.type), "Chỉ cho phép PDF/PNG/JPG")
    .refine((f) => f.size <= MAX_FILE_SIZE, "Kích thước tệp tối đa 10MB"),
});

const querySchema = z.object({
  verifyUrl: z
    .string()
    .url("URL không hợp lệ")
    .min(8, "Vui lòng nhập URL xác thực (QR link)")
});

export default function VerifyCertificatePage() {
  const [method, setMethod] = useState<"file" | "query">("file");

  const fileForm = useForm<z.input<typeof fileSchema>>({
    resolver: zodResolver(fileSchema),
    defaultValues: {
      tokenId: "",
      file: undefined as unknown as File,
    },
    shouldUnregister: true,
  });

  const queryForm = useForm<z.input<typeof querySchema>>({
    resolver: zodResolver(querySchema),
    defaultValues: {
      verifyUrl: "",
    },
    shouldUnregister: true,
  });

  const { verifyFile, verifyQuery, parseVerifyUrl } = useCertificateVerify();

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

  const onSubmitFile = (values: z.input<typeof fileSchema>) => {
    const tokenIdNum = values.tokenId ? Number(values.tokenId) : undefined;
    verifyFile.mutate({
      file: values.file as File,
      tokenId: tokenIdNum,
    });
  };

  const onSubmitQuery = (values: z.input<typeof querySchema>) => {
    const parsed = parseVerifyUrl(values.verifyUrl);
    if (!parsed) return;
    verifyQuery.mutate(parsed);
  };

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
      fileForm.setValue("file", file as File, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-var(--nav-h))] flex items-start md:items-center justify-center px-4 py-8 md:py-12">
      <div className="w-full max-w-3xl bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl shadow-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Verify Certificate</h1>
          <div className="inline-flex rounded-lg bg-muted p-1">
            <Button
              variant={method === "file" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMethod("file")}
              className="rounded-md"
              type="button"
            >
              <FileText className="mr-2 h-4 w-4" /> File Upload
            </Button>
            <Button
              variant={method === "query" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMethod("query")}
              className="rounded-md"
              type="button"
            >
              <QrCode className="mr-2 h-4 w-4" /> QR / URL
            </Button>
          </div>
        </div>

        {method === "file" ? (
          <Form {...fileForm} key="file">
             <form onSubmit={fileForm.handleSubmit(onSubmitFile)} className="space-y-5">
               <FormField
                 control={fileForm.control}
                 name="file"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Chọn file chứng chỉ (PDF/PNG/JPG, ≤ 10MB)</FormLabel>
                     <FormControl>
                       <div className="space-y-2">
                         <Input
                           type="file"
                           accept=".pdf,.png,.jpg,.jpeg"
                           className="hidden"
                           ref={fileInputRef}
                           onChange={(e) => {
                             handleFileChange(e);
                             const f = e.target.files?.[0];
                             fileForm.setValue("file", f as File, {
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
                              <p className="text-sm font-medium">Click để chọn</p>
                              <p className="text-xs text-muted-foreground">Hoặc kéo thả file vào đây</p>
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
                                        fileForm.setValue("file", undefined as unknown as File, {
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
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-black/20">
                                  <div className="flex flex-col items-center gap-3 p-4">
                                    <FileText className="h-10 w-10 text-muted-foreground" />
                                    <p className="text-sm">{fileName || "File đã chọn"}</p>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={handleThumbnailClick}
                                        type="button"
                                      >
                                        <Upload className="h-4 w-4 mr-2" /> Đổi file
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => {
                                          handleRemove();
                                          fileForm.setValue("file", undefined as unknown as File, {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                          });
                                        }}
                                        type="button"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" /> Xóa
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {previewUrl && (field.value as File) && (
                              <a
                                href={previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600 z-10"
                              >
                                Mở file
                              </a>
                            )}
                          </div>
                        )}

                        {field.value && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{fileName}</span>
                            <span>•</span>
                            <span>{((field.value as File).size / 1024 / 1024).toFixed(2)}MB</span>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={fileForm.control}
                name="tokenId"
                defaultValue=""
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Token ID (tuỳ chọn)</FormLabel>
                     <FormControl>
                       <div className="space-y-2">
                         <Input placeholder="Ví dụ: 123" value={(field.value as string) ?? ""} onChange={field.onChange} name={field.name} ref={field.ref} />
                       </div>
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />

              <div className="flex justify-end">
                <Button type="submit" disabled={verifyFile.isPending}>
                  {verifyFile.isPending ? "Đang xác thực..." : "Xác thực"}
                </Button>
              </div>

              {verifyFile.data && (
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Kết quả xác thực</span>
                  </div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Token ID:</span>
                      <div className="font-medium">{verifyFile.data.data.tokenId}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Hash type:</span>
                      <div className="font-medium">{verifyFile.data.data.typeHash}</div>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-muted-foreground">Token URI:</span>
                      <div className="font-medium break-all">{verifyFile.data.data.tokenURI}</div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </Form>
        ) : (
          <Form {...queryForm} key="query">
            <form onSubmit={queryForm.handleSubmit(onSubmitQuery)} className="space-y-5">
              <FormField
                control={queryForm.control}
                name="verifyUrl"
                defaultValue=""
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Verification URL (QR link)</FormLabel>
                     <FormControl>
                       <div className="space-y-2">
                         <Input placeholder="Dán URL từ QR" value={(field.value as string) ?? ""} onChange={field.onChange} name={field.name} ref={field.ref} />
                       </div>
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />

              <div className="flex justify-end">
                <Button type="submit" disabled={verifyQuery.isPending}>
                  {verifyQuery.isPending ? "Đang xác thực..." : "Xác thực"}
                </Button>
              </div>

              {verifyQuery.data && (
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Kết quả xác thực</span>
                  </div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Token ID:</span>
                      <div className="font-medium">{verifyQuery.data.data.tokenId}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Contract:</span>
                      <div className="font-medium break-all">{verifyQuery.data.data.contractAddress}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Chain ID:</span>
                      <div className="font-medium">{verifyQuery.data.data.chainId}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Owner:</span>
                      <div className="font-medium break-all">{verifyQuery.data.data.owner}</div>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-muted-foreground">Token URI:</span>
                      <div className="font-medium break-all">{verifyQuery.data.data.tokenURI}</div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}