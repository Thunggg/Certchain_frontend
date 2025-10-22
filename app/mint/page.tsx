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
import { useEffect, useState } from "react";

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
      file: new File([], "example.pdf"),
    },
  });

  const { mutate, data, error, isPending, isSuccess } = useMintCertificate();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileValue = form.watch("file");

  useEffect(() => {
    const f = fileValue as File | undefined;
    if (f && f.type?.startsWith("image/")) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [fileValue]);

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
            setPreviewUrl(null);
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
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        form.setValue("file", f as File, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }}
                    />
                  </FormControl>
                  {field.value && (
                    <p className="text-xs text-gray-400">
                      {field.value.name} —{" "}
                      {(field.value.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                  {previewUrl && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-white/10 bg-black/20">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-56 object-contain bg-black/40"
                      />
                    </div>
                  )}
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
              <div className="text-xs text-green-400 space-y-1">
                <p>Minted tokenId: {data.data.tokenId}</p>
                <a
                  href={data.data.qrUrl}
                  className="underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Verify Link
                </a>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
