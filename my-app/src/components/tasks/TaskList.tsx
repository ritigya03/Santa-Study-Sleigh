import React from "react";

export default function TaskList({ tasks = [] }: { tasks?: string[] }) {
  return (
    <ul className="space-y-2">
      {tasks.map((t, i) => (
        <li key={i} className="rounded border p-3">
          <label className="flex w-full items-center gap-3">
            <input type="checkbox" aria-label={`Mark ${t} complete`} />
            <span>{t}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
