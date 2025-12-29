import React from "react";

type Variant = "primary" | "ghost" | "secondary" | "link";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-lg",
  icon: "p-2",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const base = `inline-flex items-center justify-center rounded-full font-medium ${sizeClasses[size]}`;
  const variants: Record<Variant, string> = {
    primary: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent border border-gray-200 hover:bg-gray-50",
    secondary: "bg-green-600 text-white hover:bg-green-700",
    link: "bg-transparent underline text-inherit hover:text-white",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
