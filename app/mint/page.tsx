'use client'

import * as z from "zod"; 
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const starknetAddress = /^0x[0-9a-fA-F]{1,64}$/;
const allowedMime = ["application/pdf", "image/png", "image/jpeg"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// const MIN_DATE = new Date("2000-01-01");

const formSchema = z.object({
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

  issueDate: z
    .coerce
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
    .instanceof(File, { message: "Tệp không hợp lệ" })
    .refine((f) => allowedMime.includes(f.type), "Chỉ cho phép PDF/PNG/JPG")
    .refine((f) => f.size <= MAX_FILE_SIZE, "Kích thước tệp tối đa 10MB"),
})
.superRefine((data, ctx) => {
  if (data.issuerWallet === data.recipientWallet) {
    ctx.addIssue({
      code: "custom",
      message: "Ví người nhận phải khác ví người phát hành",
      path: ["recipientWallet"],
    })
  }
})

export default function MintPage() {
  // 1. Define your form.
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
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.input<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    alert("Form submitted successfully")
    console.log(values)
  }


  return (
    <Form {...form}>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="certificateName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certificate Name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
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
                <Input placeholder="shadcn" {...field} />
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
                <Input type="date" value={String(field.value ?? "")} onChange={field.onChange} onBlur={field.onBlur} name={field.name} ref={field.ref} />
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
                <Input placeholder="shadcn" {...field} />
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
                <Input placeholder="shadcn" {...field} />
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
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}