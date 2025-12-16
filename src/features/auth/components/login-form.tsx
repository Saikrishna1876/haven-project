"use client";
import Link from "next/link";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import SocialLogin from "./social-login";
import { useRouter } from "next/navigation";

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { control, handleSubmit, formState } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormValues) => {
    startTransition(async () => {
      const res = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      if (res.error) {
        toast.error(`Login error: ${res.error.message}`);
        // Handle login error (e.g., show a toast notification)
        return;
      }
      toast.success("Login successful");
      router.push("/dashboard");
    });
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                {/* <GalleryVerticalEnd className="size-6" /> */}
                {/* Icon */}
              </div>
              <span className="sr-only">
                {process.env.NEXT_PUBLIC_APP_NAME}.
              </span>
            </Link>
            <h1 className="text-xl font-bold">
              Welcome to {process.env.NEXT_PUBLIC_APP_NAME}.
            </h1>
            <FieldDescription>
              Don&apos;t have an account? <Link href="/signup">Sign up</Link>
            </FieldDescription>
          </div>

          <Controller
            control={control}
            name="email"
            rules={{
              required: { value: true, message: "Email is required" },
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            }}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="m@example.com"
                  aria-invalid={!!fieldState.error}
                  required
                  disabled={isPending}
                />
                <FieldError
                  errors={fieldState.error ? [fieldState.error] : []}
                />
              </Field>
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: { value: true, message: "Password is required" },
            }}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  aria-invalid={!!fieldState.error}
                  required
                  disabled={isPending}
                />
                <FieldError
                  errors={fieldState.error ? [fieldState.error] : []}
                />
              </Field>
            )}
          />

          <Field>
            <Button
              type="submit"
              disabled={formState.isSubmitting || isPending}
            >
              Login
            </Button>
          </Field>

          <FieldSeparator>Or</FieldSeparator>
          <Field className="w-full">
            <SocialLogin />
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
