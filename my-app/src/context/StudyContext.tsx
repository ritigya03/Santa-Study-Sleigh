"use client";

import React, { createContext, useContext, useState } from "react";

interface StudyState {
  sessionsCompleted: number;
  tasks: string[];
}

interface StudyContextValue extends StudyState {
  addSession: () => void;
  addTask: (t: string) => void;
}

const StudyContext = createContext<StudyContextValue | undefined>(undefined);

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [tasks, setTasks] = useState<string[]>([]);

  const addSession = () => setSessionsCompleted((s) => s + 1);
  const addTask = (t: string) => setTasks((prev) => [...prev, t]);

  return (
    <StudyContext.Provider
      value={{ sessionsCompleted, tasks, addSession, addTask }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error("useStudy must be used within StudyProvider");
  return ctx;
}
