'use client';

import React, { useState } from 'react';
import {
  Bot,
  Send,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  Heart,
  Droplets,
  Apple,
  RefreshCw,
  User,
} from 'lucide-react';
import { INITIAL_BP_READINGS, INITIAL_GLUCOSE_READINGS } from '@/lib/mock-data';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: `Hello Arun. I am your **GlycoPulse AI Health Assistant**.

I analyze your recorded blood pressure readings, glucose trends, current medications, and lifestyle notes to provide educational guidance.

How can I assist your health management today? You can ask about:
- Your recent blood pressure and sugar trends.
- Dietary recommendations for Indian meals with diabetes & hypertension.
- Questions to prepare for your next consultation with Dr. Rajesh Sharma.

*Important: I am an AI, not a doctor. I do not diagnose illnesses or adjust medications.*`,
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleQuestions = [
    'What do my recent BP and fasting sugar trends mean?',
    'What Indian foods should I include or avoid for Type 2 diabetes?',
    'Why is fasting sugar different from post-meal sugar?',
    'What questions should I ask my diabetologist during my visit?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          patientProfile: {
            full_name: 'Arun Kumar',
            diabetes_type: 'Type 2',
            existing_conditions: ['Hypertension', 'Dyslipidemia'],
            current_medications_summary: 'Metformin 500mg BD, Telmisartan 40mg OD',
          },
          recentBP: INITIAL_BP_READINGS[INITIAL_BP_READINGS.length - 1],
          recentGlucose: {
            fasting: '102 mg/dL',
            postMeal: '140 mg/dL',
          },
        }),
      });

      const data = await response.json();
      if (data.content) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ast-${Date.now()}`,
            role: 'assistant',
            content: data.content,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ast-${Date.now()}`,
          role: 'assistant',
          content: 'Unable to connect to the assistant right now. Please verify your connection or try again shortly.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              AI Health Assistant &amp; Clinical Insights
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-200">
                AI Powered
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Personalized analysis connected to your latest vitals, medications &amp; targets
            </p>
          </div>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Medical Safety &amp; Disclaimer:</span> GlycoPulse AI is an educational tool. It does not diagnose medical conditions, prescribe drugs, or modify existing medication dosages. In case of acute symptoms (e.g. chest pressure, fainting, severe hypoglycemia &lt;70 mg/dL), contact emergency healthcare services immediately.
        </div>
      </div>

      {/* Chat Display Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[560px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-amber-500 text-slate-950 shadow-xs'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs whitespace-pre-line'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-50 border border-slate-200 text-slate-500 text-xs py-3 px-4 rounded-2xl animate-pulse">
                Analyzing your blood pressure and glycemic patterns...
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-bold text-slate-500 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Suggested:
          </span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full text-slate-700 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about your BP, glucose trends, diet, or doctor questions..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors shadow-xs"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
