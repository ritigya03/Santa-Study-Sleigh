"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Gift, Play, X, ClipboardList, Music } from "lucide-react";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Snowfall } from "../components/snowfall";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTaskCreated, setIsTaskCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("santaTasks");
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
        setIsTaskCreated(true);
      }
    } catch (error) {
      console.error("Failed to load tasks from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("santaTasks", JSON.stringify(tasks));
      } catch (error) {
        console.error("Failed to save tasks to localStorage:", error);
      }
    }
  }, [tasks, isLoading]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setTasks([
      ...tasks,
      { id: Math.random().toString(), text: newTask, completed: false },
    ]);

    setNewTask("");
    setIsTaskCreated(true);
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const clearAllTasks = () => {
    if (confirm("Are you sure you want to clear all tasks?")) {
      setTasks([]);
      setIsTaskCreated(false);
      setIsFormOpen(false);
    }
  };

  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4 bg-cover bg-center bg-fixed landing-hero">
        <Snowfall />
        <p className="text-white text-2xl">Loading...</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4 bg-cover bg-center bg-fixed landing-hero">
      <Snowfall />

      <div className="relative z-1 text-center">
        {/* Sleigh */}
        <div className="relative group perspective-1000">
          <div className="absolute top-48 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-50 pointer-events-none z-1 opacity-30">
            <svg viewBox="0 0 1000 200" fill="none" className="w-full h-full">
              <path
                d="M-100,100 Q200,50 500,100 T1100,100"
                stroke="white"
                strokeWidth="4"
                strokeDasharray="12 12"
                className="animate-[dash_20s_linear_infinite]"
              />
            </svg>
            <style jsx>{`
              @keyframes dash {
                to {
                  stroke-dashoffset: -1000;
                }
              }
            `}</style>
          </div>

          <div className="animate-sleigh-vertical relative z-2 -mt-16 md:-mt-14">
            <Image
              src="/images/Santa-sleigh.png"
              alt="Santa's Sleigh"
              width={700}
              height={420}
              priority
              className="h-36 md:h-80  w-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)]"
            />

            {/* Gifts on sleigh */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-wrap-reverse justify-center gap-1 max-w-37.5">
              {tasks.map((_, i) => (
                <Gift
                  key={i}
                  className="h-8 w-8 text-primary animate-bounce drop-shadow-md"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2 ">
          <h1 className="text-5xl md:text-7xl font-black text-green-200 font-serif drop-shadow-2xl tracking-tight">
            Santa Study Sleigh
          </h1>
          <p className="text-lg md:text-xl text-red-100/90 font-medium drop-shadow-md leading-tight">
            Your festive mission starts here.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-6 mt-8">
          {!isFormOpen && !isTaskCreated && (
            <Button
              size="lg"
              onClick={() => setIsFormOpen(true)}
              className="h-16 px-10 text-xl font-bold rounded-full shadow-2xl hover:scale-105 transition-transform bg-primary"
            >
              <Plus className="mr-2 h-6 w-6" /> Create Tasks
            </Button>
          )}

          {isFormOpen && (
            <div className="w-full max-w-md bg-white/20  p-6 rounded-4xl shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-black  flex items-center gap-2">
                  <Gift className="text-primary" /> New Task
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFormOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <form onSubmit={addTask} className="space-y-4">
                <Input
                  autoFocus
                  placeholder="What's your goal?"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="h-12 text-base bg-muted/50 border-none rounded-xl"
                />

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="flex-1 h-12 text-base font-bold"
                  >
                    Add Gift
                  </Button>

                  {tasks.length > 0 && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setIsFormOpen(false);
                      }}
                      className="h-12 px-6"
                    >
                      Done
                    </Button>
                  )}
                </div>
              </form>

              {tasks.length > 0 && (
                <div className="mt-4 pt-4 border-t border-muted space-y-3">
                  <p className="italic text-muted-foreground text-sm">
                    {tasks.length} gifts ready to be packed...
                  </p>

                  {/* Task List
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-2 bg-white/10 p-2 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task.id)}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span
                          className={`flex-1 text-sm ${
                            task.completed
                              ? "line-through text-muted-foreground"
                              : "text-white"
                          }`}
                        >
                          {task.text}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div> */}
                </div>
              )}
            </div>
          )}

          {isTaskCreated && !isFormOpen && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <p className="text-white font-medium flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-accent" />
                  {tasks.length} Missions Loaded
                </p>
              </div>

              <Link href="/dashboard">
                <Button className="h-16 px-12 text-2xl font-black rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-all bg-accent text-accent-foreground hover:scale-105">
                  <Play className="mr-3 h-8 w-8" /> START STUDYING
                </Button>
              </Link>

              <Button
                variant="link"
                className="text-white/70 hover:text-white"
                onClick={() => {
                  setIsFormOpen(true);
                }}
              >
                Edit Tasks
              </Button>

              <Button
                variant="link"
                className="text-white/70 hover:text-white text-sm"
                onClick={clearAllTasks}
              >
                Clear All Tasks
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="secondary"
          size="icon"
          className="w-14 h-14 rounded-full shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white transition-all hover:scale-110"
          onClick={() =>
            console.log("[v0] Music button ready for your integration!")
          }
        >
          <Music className="h-7 w-7" />
          <span className="sr-only">Music Toggle</span>
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-48 bg-linear-to-t from-black/60 to-transparent pointer-events-none z-0" />
    </main>
  );
}