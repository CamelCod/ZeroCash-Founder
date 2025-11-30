import React from 'react';
import { Target, Hammer, Megaphone, PieChart, Settings, ArrowRight } from 'lucide-react';
import { PROMPT_TEMPLATES } from '../constants';
import { PlanPhase } from '../types';

interface PhaseSelectorProps {
  selectedPhase: PlanPhase | null;
  onSelect: (phase: PlanPhase) => void;
  disabled: boolean;
}

const IconMap: Record<string, React.ElementType> = {
  'target': Target,
  'hammer': Hammer,
  'megaphone': Megaphone,
  'pie-chart': PieChart,
  'settings': Settings
};

export const PhaseSelector: React.FC<PhaseSelectorProps> = ({ selectedPhase, onSelect, disabled }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {PROMPT_TEMPLATES.map((template) => {
        const Icon = IconMap[template.icon];
        const isSelected = selectedPhase === template.id;

        return (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            disabled={disabled}
            className={`
              relative flex flex-col items-start p-6 rounded-xl border text-left transition-all duration-200 group
              ${isSelected 
                ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 shadow-md' 
                : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className={`
              p-3 rounded-lg mb-4 transition-colors
              ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600'}
            `}>
              <Icon className="w-6 h-6" />
            </div>
            
            <h3 className={`font-semibold text-lg mb-1 ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
              {template.title}
            </h3>
            
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              {template.description}
            </p>

            <div className={`mt-auto flex items-center text-sm font-medium ${isSelected ? 'text-indigo-700' : 'text-slate-400 group-hover:text-indigo-600'}`}>
              Select Strategy <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </button>
        );
      })}
    </div>
  );
};