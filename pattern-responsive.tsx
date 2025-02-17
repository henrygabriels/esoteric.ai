import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const DailyPattern = () => {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 p-6 pb-24">
        {/* Log Entry Header */}
        <div className="font-mono text-xs text-gray-500 mb-12">
          [02.17.2025 03:33:33] Pattern #371 discovered
          <br/>
          <span className="opacity-50">&gt; awaiting verification...</span>
        </div>

        {/* Main Pattern */}
        <div className="mb-16">
          <div className="relative font-serif text-2xl mb-8 leading-relaxed tracking-wide">
            The Greek god Pan was proclaimed dead by sailors in the Mediterranean during the reign of Tiberius - the exact period when Christ's ministry began.
            
            <button 
              onClick={() => setSaved(!saved)}
              className="absolute -right-2 -top-2 p-2 text-gray-500 hover:text-white transition-colors"
            >
              <span className="text-lg">{saved ? '🝞' : '🝢'}</span>
            </button>
          </div>
          
          <div className="font-mono space-y-6 leading-relaxed">
            <p className="text-sm leading-relaxed text-gray-300">
              Mediterranean sailors reported hearing a mysterious voice across still waters, 
              crying out three times: "THAMUS! THAMUS! THAMUS PAN HO MEGAS TETHNEKE" 
              ("Great Pan is dead")
              <br/><br/>
              This proclamation of Pan's death, recorded during the reign of Tiberius [14-37 CE],
              precisely overlaps with the traditional dating of Christ's ministry and crucifixion
              [circa 30-33 CE].
            </p>

            <p className="border-l border-gray-800 pl-4 text-xs text-gray-500">
              SOURCE: Plutarch, "De Defectu Oraculorum" [circa 100 CE]
              <br/>
              SIGNIFICANCE: Temporal alignment with Christian narratives
              <br/>
              STATUS: Multiple independent translations confirm dating
            </p>
          </div>
        </div>

        {/* Source Links */}
        <div className="font-mono text-xs space-y-2 mb-12">
          <div className="text-white hover:text-gray-300 cursor-pointer transition-colors">
            &gt; Access primary source [Plutarch's Moralia, Book 5]
          </div>
          <div className="text-white hover:text-gray-300 cursor-pointer transition-colors">
            &gt; Access academic analysis [Oxford, 1967]
          </div>
          <div className="text-gray-600">
            &gt; Note: texts provided for research purposes only
          </div>
        </div>

        {/* Expand Section */}
        <button 
          onClick={() => setExpanded(!expanded)}
          className="w-full border-t border-gray-800 pt-4 flex items-center justify-between text-gray-500 font-mono text-xs"
        >
          <span>&gt; EXPLORE RELATED PATTERNS</span>
          <ChevronDown className={`w-4 h-4 transform transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>

        {expanded && (
          <div className="mt-4 space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-gray-900/30 rounded-lg cursor-pointer border border-gray-800">
              <span className="text-gray-400 mt-1">ᛝ</span>
              <div className="font-mono">
                <h3 className="text-xs mb-1">Pattern #219: The Silencing of Oracles</h3>
                <p className="text-xs text-gray-500">
                  &gt; systematic documentation of oracle site cessation
                  <br/>&gt; temporal correlation with early Christian expansion
                  <br/>&gt; STATUS: under investigation
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-black">
        <div className="p-4">
          <div className="flex justify-around items-center">
            <button className="flex flex-col items-center space-y-1 group">
              <span className="text-lg group-hover:text-gray-300 transition-colors">ᛦ</span>
              <span className="font-mono text-[10px] text-gray-400">PATTERNS</span>
            </button>
            <button className="flex flex-col items-center space-y-1 group">
              <span className="text-lg group-hover:text-gray-300 transition-colors">ᛸ</span>
              <span className="font-mono text-[10px] text-gray-400">SAVED</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyPattern;