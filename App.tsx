import React, { useState, useCallback, useRef } from 'react';
import { Layout } from './components/Layout';
import { PhaseSelector } from './components/PhaseSelector';
import { MarkdownRenderer } from './components/MarkdownRenderer';
import { ChartRenderer } from './components/ChartRenderer';
import { generateBusinessPlan } from './services/geminiService';
import { PROMPT_TEMPLATES, BUSINESS_TYPES } from './constants';
import { BusinessType, PlanPhase, UserInput, GeneratedPlan } from './types';
import { Loader2, Sparkles, AlertCircle, CheckCircle2, Copy, Download, Printer } from 'lucide-react';

export default function App() {
  const [input, setInput] = useState<UserInput>({
    businessIdea: '',
    businessType: BusinessType.SERVICE,
  });

  const [selectedPhase, setSelectedPhase] = useState<PlanPhase | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleInputChange = (field: keyof UserInput, value: string) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = useCallback(async () => {
    if (!selectedPhase || !input.businessIdea.trim()) return;

    setLoading(true);
    setError(null);
    setGeneratedPlan(null);
    setCopySuccess(false);

    try {
      const template = PROMPT_TEMPLATES.find(t => t.id === selectedPhase);
      if (!template) throw new Error("Template not found");

      const prompt = template.promptBuilder(input);
      // Now returns an object with { markdownContent, chart }
      const response = await generateBusinessPlan(prompt);

      setGeneratedPlan({
        phase: selectedPhase,
        content: response.markdownContent,
        chart: response.chart,
        timestamp: Date.now()
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [input, selectedPhase]);

  const handleCopyToClipboard = async () => {
    if (!generatedPlan) return;
    try {
      await navigator.clipboard.writeText(generatedPlan.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="flex flex-col gap-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 no-print">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Launch Your Business for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">$0</span>
          </h2>
          <p className="text-lg text-slate-600">
            Tell us about your idea, and our AI will act as your co-founder to generate specific, zero-cost strategies and visualizations for every stage of your journey.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 max-w-4xl mx-auto w-full no-print">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="idea" className="block text-sm font-medium text-slate-700 mb-2">
                What is your business idea?
              </label>
              <input
                type="text"
                id="idea"
                placeholder="e.g. Freelance Graphic Design for Non-profits"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
                value={input.businessIdea}
                onChange={(e) => handleInputChange('businessIdea', e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-2">
                Business Type
              </label>
              <div className="relative">
                <select
                  id="type"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none bg-white appearance-none"
                  value={input.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value as BusinessType)}
                >
                  {BUSINESS_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Selection Section */}
        <div className="max-w-6xl mx-auto w-full no-print">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white text-sm">2</span>
              Choose Your Focus
            </h3>
            {selectedPhase && (
               <button 
                 onClick={handleGenerate}
                 disabled={loading || !input.businessIdea.trim()}
                 className={`
                   hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg
                   ${loading || !input.businessIdea.trim() ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800'}
                 `}
               >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                 Generate Plan
               </button>
            )}
          </div>

          <PhaseSelector 
            selectedPhase={selectedPhase} 
            onSelect={setSelectedPhase} 
            disabled={loading} 
          />
          
          {/* Mobile Generate Button */}
          <div className="md:hidden flex justify-center">
            <button 
                onClick={handleGenerate}
                disabled={loading || !input.businessIdea.trim() || !selectedPhase}
                className={`
                  w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-lg
                  ${loading || !input.businessIdea.trim() || !selectedPhase ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 active:bg-indigo-700'}
                `}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {loading ? 'Thinking...' : 'Generate Plan'}
              </button>
          </div>
        </div>

        {/* Results Section */}
        {error && (
          <div className="max-w-4xl mx-auto w-full bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading && (
          <div className="max-w-4xl mx-auto w-full py-12 flex flex-col items-center justify-center text-slate-500 animate-pulse">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
            <p className="text-lg font-medium">Consulting our digital mentors...</p>
            <p className="text-sm">Analyzing {input.businessIdea} for zero-cash strategies and data models.</p>
          </div>
        )}

        {generatedPlan && !loading && (
          <div className="max-w-4xl mx-auto w-full mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500 print-content">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              
              {/* Report Header & Toolbar */}
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                   <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                   <div>
                     <h3 className="font-bold text-slate-800">Generated Plan: {generatedPlan.phase}</h3>
                     <p className="text-xs text-slate-500 hidden sm:block">for {input.businessIdea} ({input.businessType})</p>
                   </div>
                </div>
                
                <div className="flex items-center gap-2 no-print">
                  <button 
                    onClick={handleCopyToClipboard}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    title="Copy Report to Clipboard"
                  >
                    {copySuccess ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copySuccess ? 'Copied' : 'Copy'}
                  </button>
                  <button 
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                    title="Download/Print as PDF"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                  <div className="w-px h-6 bg-slate-300 mx-1"></div>
                  <button 
                    onClick={() => setGeneratedPlan(null)}
                    className="text-sm text-slate-400 hover:text-red-500 font-medium px-2"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="p-6 md:p-12 print:p-0 print:m-8">
                {/* Print Only Header */}
                <div className="hidden print:block mb-8 border-b border-slate-200 pb-4">
                   <h1 className="text-3xl font-bold text-slate-900">ZeroCash Founder Report</h1>
                   <p className="text-slate-500 mt-2">Strategy for: {input.businessIdea}</p>
                   <p className="text-slate-400 text-sm">Phase: {generatedPlan.phase}</p>
                </div>

                {generatedPlan.chart && (
                  <div className="mb-8 page-break-inside-avoid">
                    <ChartRenderer data={generatedPlan.chart} />
                  </div>
                )}

                <MarkdownRenderer content={generatedPlan.content} />
              </div>
              
              <div className="bg-indigo-50 px-6 py-4 border-t border-indigo-100 no-print">
                <p className="text-sm text-indigo-800 text-center">
                  💡 <strong>Pro Tip:</strong> Take one step at a time. This plan assumes zero budget, so your time and effort are your currency.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}