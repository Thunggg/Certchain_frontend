  "use client";

  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { useState } from "react";
  import { useForm } from "react-hook-form";
  import { z } from "zod";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { Upload, FileText, X } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { Label } from "@/components/ui/label";
  import { Input } from "@/components/ui/input";
  import { Textarea } from "@/components/ui/textarea";
  import { Calendar } from "@/components/ui/calendar";
  import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

  const formSchema = z.object({
    certName: z.string().min(3, "Name must be at least 3 characters"),
    recipient: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid address (expected 0x + 40 hex)"),
    description: z
      .string()
      .min(5, "Description is too short")
      .max(500, "Max 500 characters"),
    issuer: z.string().min(2, "Issuer is required"),
    issueDate: z
      .string()
      .refine((v) => v && !isNaN(Date.parse(v)), { message: "Invalid date" }),
    file: z
      .instanceof(File, { message: "File is required" })
      .refine(
        (f) => f && (f.type === "application/pdf" || f.type.startsWith("image/")),
        {
          message: "Unsupported file type",
        }
      ),
  });

  type FormValues = z.infer<typeof formSchema>;

  export default function MintCertificatePage() {
    const [isDragging, setIsDragging] = useState(false);
    const [openDate, setOpenDate] = useState(false);

    const {
      register,
      handleSubmit,
      setValue,
      watch,
      formState: { errors, isSubmitting },
      reset,
      resetField,
    } = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        certName: "",
        recipient: "",
        description: "",
        issuer: "",
        issueDate: "",
      },
    });

    const watchedFile = watch("file") as File | undefined;

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        setValue("file", droppedFile, { shouldValidate: true });
      }
    };

    const onSubmit = async (_values: FormValues) => {
      // TODO: call backend mint API with FormData
    };

    return (
      <div className="px-6 lg:px-8 py-8">
        <div className="max-w-xl mx-auto space-y-6">
          {/* header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Mint Certificate</h1>
            <p className="text-sm text-muted-foreground">
              Create a new blockchain certificate (SBT)
            </p>
          </div>

          {/* form */}
          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">
                Upload Certificate File
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* File Upload Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
                    isDragging
                      ? "border-primary bg-primary/10 glow-border"
                      : `border-border hover:border-primary/50 ${
                          errors.file ? "border-destructive" : ""
                        }`
                  }`}
                >
                  {watchedFile ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-3">
                        <FileText className="h-12 w-12 text-primary" />
                        <div className="text-left">
                          <p className="font-medium text-foreground">
                            {watchedFile.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {(watchedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => resetField("file")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-foreground font-medium">
                          Drag and drop your file here
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          or click to browse
                        </p>
                      </div>
                      <input
                        type="file"
                        {...register("file")}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label htmlFor="file-upload">
                        <Button variant="outline" asChild>
                          <span>Choose File</span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
                {errors.file && (
                  <p className="text-xs text-destructive text-left">
                    {errors.file.message as string}
                  </p>
                )}

                {/* Metadata Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cert-name" className="text-foreground">
                      Certificate Name
                    </Label>
                    <Input
                      id="cert-name"
                      placeholder="e.g., Graduation Certificate 2025"
                      className={`bg-input border-border text-foreground ${
                        errors.certName ? "border-destructive" : ""
                      }`}
                      aria-invalid={!!errors.certName}
                      {...register("certName")}
                    />
                    {errors.certName && (
                      <p className="text-xs text-destructive">
                        {errors.certName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipient" className="text-foreground">
                      Recipient Address
                    </Label>
                    <Input
                      id="recipient"
                      placeholder="0x..."
                      className={`bg-input border-border text-foreground font-mono ${
                        errors.recipient ? "border-destructive" : ""
                      }`}
                      aria-invalid={!!errors.recipient}
                      {...register("recipient")}
                    />
                    {errors.recipient && (
                      <p className="text-xs text-destructive">
                        {errors.recipient.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-foreground">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Add details about this certificate..."
                      className={`bg-input border-border text-foreground min-h-24 ${
                        errors.description ? "border-destructive" : ""
                      }`}
                      aria-invalid={!!errors.description}
                      {...register("description")}
                    />
                    {errors.description && (
                      <p className="text-xs text-destructive">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="issuer" className="text-foreground">
                        Issuer Name
                      </Label>
                      <Input
                        id="issuer"
                        placeholder="Organization name"
                        className={`bg-input border-border text-foreground ${
                          errors.issuer ? "border-destructive" : ""
                        }`}
                        aria-invalid={!!errors.issuer}
                        {...register("issuer")}
                      />
                      {errors.issuer && (
                        <p className="text-xs text-destructive">
                          {errors.issuer.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issue-date" className="text-foreground">
                        Issue Date
                      </Label>
                      <Popover open={openDate} onOpenChange={setOpenDate}>
                        <PopoverTrigger asChild>
                          <Input
                            id="issue-date"
                            readOnly
                            placeholder="Select a date"
                            value={(() => {
                              const v = watch("issueDate");
                              return v ? new Date(v).toLocaleDateString() : "";
                            })()}
                            onClick={() => setOpenDate(true)}
                            className={`bg-input border-border text-foreground cursor-pointer ${
                              errors.issueDate ? "border-destructive" : ""
                            }`}
                            aria-invalid={!!errors.issueDate}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="p-0" align="start">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            selected={(function(){
                              const v = watch("issueDate");
                              return v ? new Date(v) : undefined;
                            })()}
                            onSelect={(date) => {
                              setValue("issueDate", date?.toISOString() || "", { shouldValidate: true });
                              setOpenDate(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.issueDate && (
                        <p className="text-xs text-destructive">
                          {errors.issueDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1 bg-primary text-primary-foreground glow-border-subtle cursor-pointer"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Minting..." : "Mint Certificate"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent cursor-pointer"
                    onClick={() => reset()}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
