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

type SignUpFormValues = {
  name: string;
  email: string;
  password: string;
};

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition();
  const { control, handleSubmit, formState } = useForm<SignUpFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    startTransition(async () => {
      const res = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (res.error) {
        console.log("Signup error:", res.error);
        toast.error(`Signup error: ${res.error.message}.`);
        return;
      }
      toast.success(`Signup successful.`);
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
              <span className="sr-only"></span>
            </Link>
            <h1 className="text-xl font-bold">
              Welcome to {process.env.NEXT_PUBLIC_APP_NAME}.
            </h1>
            <FieldDescription>
              Already have an account? <Link href="/login">Sign in</Link>
            </FieldDescription>
          </div>

          <Controller
            control={control}
            name="name"
            rules={{ required: { value: true, message: "Name is required" } }}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="John Doe"
                  aria-invalid={!!fieldState.error}
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
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="m@example.com"
                  aria-invalid={!!fieldState.error}
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
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
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
              Create Account
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
