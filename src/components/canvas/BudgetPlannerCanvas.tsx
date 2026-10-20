import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { formatINR } from '../../utils/calculator';
import { 
  Wallet, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  ArrowRight,
  PieChart,
  BarChart3,
  DollarSign
} from 'lucide-react';

export const BudgetPlannerCanvas: React.FC = () => {
  const { 
    project, 
    updateProjectDetails, 
    calculationResult, 
    setActiveRoomId, 
    setActiveViewMode 
  } = useProject();

  const [budgetInput, setBudgetInput] = useState<string>(
    project.targetBudget ? project.targetBudget.toString() : '175000'
  );

  const grandTotal = calculationResult.grandTotalINR;
  const targetBudget = project.targetBudget || 0;
  const diff = targetBudget - grandTotal;
  const isOverBudget = targetBudget > 0 && diff < 0;
  const percentUsed = targetBudget > 0 ? Math.min(100, Math.round((grandTotal / targetBudget) * 100)) : 0;

  // Handle budget input
  const handleBudgetChange = (val: string) => {
    setBudgetInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      updateProjectDetails({ targetBudget: num });
    }
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-[#EDE8DF] select-none overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-border/80 sticky top-0 z-10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-charcoal text-ivory rounded-md">
              Live Budget Optimizer
            </span>
            <span className="text-sm font-serif font-medium text-charcoal">
              Financial Transparency Engine
            </span>
          </div>
          <p className="text-xs text-muted mt-1">
            Track allocations across rooms and discover architectural value engineering opportunities.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <label className="text-xs font-medium text-muted">Target Budget:</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-serif font-bold text-muted">₹</span>
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => handleBudgetChange(e.target.value)}
              className="w-36 pl-7 pr-3 py-1.5 text-xs font-semibold bg-white border border-border rounded-lg text-charcoal focus:outline-none focus:ring-1 focus:ring-brass"
              placeholder="150000"
            />
          </div>
        </div>
      </div>

      {/* Main Budget Dashboard */}
      <div className="p-8 max-w-5xl mx-auto w-full space-y-6">
        
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-border shadow-subtle">
            <div className="flex items-center justify-between text-muted text-xs">
              <span>Target Budget</span>
              <Wallet className="w-4 h-4 text-brass" />
            </div>
            <div className="text-2xl font-serif font-bold text-charcoal mt-2">
              {formatINR(targetBudget)}
            </div>
            <div className="text-[11px] text-muted mt-1">Configured project budget ceiling</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border shadow-subtle">
            <div className="flex items-center justify-between text-muted text-xs">
              <span>Current Estimate</span>
              <BarChart3 className="w-4 h-4 text-charcoal" />
            </div>
            <div className="text-2xl font-serif font-bold text-charcoal mt-2">
              {formatINR(grandTotal)}
            </div>
            <div className="text-[11px] text-muted mt-1">
              Materials ({formatINR(calculationResult.materialSubtotalINR)}) + Extras ({formatINR(calculationResult.accessoriesSubtotalINR)})
            </div>
          </div>

          <div className={`p-5 rounded-2xl border shadow-subtle ${
            isOverBudget 
              ? 'bg-rose-50/70 border-rose-200' 
              : 'bg-emerald-50/70 border-emerald-200'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className={isOverBudget ? 'text-rose-800' : 'text-emerald-800'}>
                {isOverBudget ? 'Budget Exceeded' : 'Remaining Balance'}
              </span>
              {isOverBudget ? (
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            <div className={`text-2xl font-serif font-bold mt-2 ${
              isOverBudget ? 'text-rose-900' : 'text-emerald-900'
            }`}>
              {formatINR(Math.abs(diff))}
            </div>
            <div className={`text-[11px] mt-1 ${isOverBudget ? 'text-rose-700' : 'text-emerald-700'}`}>
              {isOverBudget ? 'Over target allocation' : 'Available for premium upgrades'}
            </div>
          </div>
        </div>

        {/* Budget Progress Meter */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-subtle">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-charcoal">Budget Utilization</span>
            <span className="font-mono font-semibold text-charcoal">{percentUsed}%</span>
          </div>
          <div className="w-full h-3 bg-stone-light rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                isOverBudget ? 'bg-rose-500' : 'bg-brass'
              }`}
              style={{ width: `${Math.min(100, (grandTotal / (targetBudget || grandTotal || 1)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Room by Room Cost Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-subtle">
          <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-4 flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-brass" />
            <span>Cost Distribution by Room</span>
          </h3>

          <div className="space-y-4">
            {calculationResult.roomCalculations.map((room) => {
              const roomPct = grandTotal > 0 ? Math.round((room.totalMaterialCostINR / grandTotal) * 100) : 0;
              return (
                <div key={room.roomId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-charcoal">{room.roomName}</span>
                      <span className="text-muted">({room.totalAreaSqFt} sq.ft)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-medium text-charcoal">{formatINR(room.totalMaterialCostINR)}</span>
                      <span className="text-muted text-[10px]">({roomPct}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-stone-light/60 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-charcoal-muted rounded-full transition-all"
                      style={{ width: `${roomPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Smart Recommendations */}
        <div className="bg-ivory-light border border-brass/30 p-6 rounded-2xl shadow-subtle">
          <div className="flex items-center space-x-2 text-charcoal mb-3">
            <Lightbulb className="w-5 h-5 text-brass" />
            <h4 className="text-sm font-serif font-bold">Architectural Budget Suggestions</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-white rounded-xl border border-border">
              <span className="font-semibold text-charcoal block mb-1">Feature Wall Accent Focus</span>
              <p className="text-muted">
                Use luxury porcelain slab (e.g. Royal Statuario) exclusively on the 80 sq.ft feature wall while using cost-effective Travertine matte on broader floor areas.
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-border">
              <span className="font-semibold text-charcoal block mb-1">Whole-Box Procurement Efficiency</span>
              <p className="text-muted">
                Aligning bedroom and living room tile selections allows pooled box ordering, saving up to 6% in leftover wastage.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
