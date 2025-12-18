
import React from 'react';
import { UserTier } from '../types';

interface PricingProps {
  currentTier: UserTier;
  onUpgrade: (tier: UserTier) => void;
}

const Pricing: React.FC<PricingProps> = ({ currentTier, onUpgrade }) => {
  const tiers = [
    {
      name: UserTier.FREE,
      price: '$0',
      description: 'Perfect for exploring features.',
      features: [
        '3 Resume Analyses / week',
        '2 Interview Sessions / week',
        'Gemini 3 Flash Model',
        'Standard Company Research'
      ],
      buttonText: currentTier === UserTier.FREE ? 'Current Plan' : 'Downgrade',
      highlight: false
    },
    {
      name: UserTier.PRO,
      price: '$19',
      description: 'For serious job seekers.',
      features: [
        'Unlimited Resume Analyses',
        'Unlimited Interview Coaching',
        'Gemini 3 Pro High-Reasoning',
        'Deep Web Research Grounding',
        'Priority Support'
      ],
      buttonText: currentTier === UserTier.PRO ? 'Current Plan' : 'Upgrade to Pro',
      highlight: true
    },
    {
      name: UserTier.ENTERPRISE,
      price: 'Custom',
      description: 'For bootcamp and teams.',
      features: [
        'Bulk API Access',
        'Custom Interview Scenarios',
        'Shared Team Analytics',
        'Dedicated Account Manager'
      ],
      buttonText: 'Contact Sales',
      highlight: false
    }
  ];

  return (
    <div className="py-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl font-black mb-6">Choose Your <span className="gradient-text">Career Fuel</span></h2>
        <p className="text-slate-400 text-lg">Invest in your future with AI-powered tools designed to get you hired 3x faster.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tiers.map((tier) => (
          <div 
            key={tier.name}
            className={`glass rounded-3xl p-8 border flex flex-col transition-all duration-300 hover:scale-[1.02] ${
              tier.highlight ? 'border-indigo-500 shadow-2xl shadow-indigo-500/20' : 'border-white/10'
            }`}
          >
            {tier.highlight && (
              <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-widest">Most Popular</span>
            )}
            <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-black">{tier.price}</span>
              {tier.price !== 'Custom' && <span className="text-slate-500 text-sm">/month</span>}
            </div>
            <p className="text-slate-400 text-sm mb-8">{tier.description}</p>
            
            <ul className="space-y-4 mb-12 flex-1">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => tier.name !== UserTier.ENTERPRISE && onUpgrade(tier.name as UserTier)}
              disabled={currentTier === tier.name}
              className={`w-full py-4 rounded-2xl font-bold transition-all ${
                tier.highlight 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {tier.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
