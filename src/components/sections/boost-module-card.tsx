"use client";

import { Zap } from "lucide-react";

export function BoostModuleCard() {
  return (
    <div className="bg-white/10 rounded-2xl shadow-lg p-6 flex flex-col gap-4 items-start border border-white/10 backdrop-blur-lg">
      <div className="flex items-center gap-3 mb-2">
        <Zap className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold text-white">Módulo 'El Impulso'</h3>
      </div>
      <p className="text-gray-200 mb-4">Encuentra micro-acciones para superar la ansiedad y el estancamiento.</p>
      <button className="gradient-button w-full">Explorar Impulsos</button>
    </div>
  );
} 