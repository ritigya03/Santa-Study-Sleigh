import React from "react";

export default function Modal({
  children,
  open = false,
}: {
  children: React.ReactNode;
  open?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded bg-white p-6 shadow">
        {children}
      </div>
    </div>
  );
}
