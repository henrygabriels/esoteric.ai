'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { revelations } from '@/data/revelations';

interface Pattern {
  id: number;
  title: string;
  content: string;
  source: string;
  significance: string;
  status: string;
}

// TODO: Email Collection Implementation
// - Set up Substack for daily pattern emails
// - Customize email template to match esoteric aesthetic
// - Replace iframe with Substack embed URL
// - Add success state and confirmation messaging
// - Consider adding preview of first email
// - Implement local storage to remember subscribed state

export const DailyPattern: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [timestamp, setTimestamp] = useState('');
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedTime, setFormattedTime] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showLandingModal, setShowLandingModal] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [typedSecondText, setTypedSecondText] = useState('');
  const [showFinalButton, setShowFinalButton] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryText, setQueryText] = useState('');
  const [showDemandMessage, setShowDemandMessage] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'system', text: string}>>([]);
  const [loadingSteps, setLoadingSteps] = useState<string[]>([]);
  const [isError, setIsError] = useState(false);
  const [showPattern, setShowPattern] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [chatContainerRef] = useState(() => React.createRef<HTMLDivElement>());
  const loadingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const shouldContinueLoadingRef = React.useRef(true);
  const [activeTab, setActiveTab] = useState<'today' | 'query' | 'saved'>('today');
  const [emailModalSource, setEmailModalSource] = useState<'daily' | 'current' | 'other' | 'query'>('other');
  const [currentRevelation, setCurrentRevelation] = useState<Pattern | null>(null);

  const fullText = [
    '[SYSTEM INITIALIZED]',
    'esoteric.ai',
    '> STATUS: 14.2TB+ of restricted texts successfully archived.',
    '> SOURCE MATERIAL: Ancient, historic, and modern documents concerning the esoteric, the supernatural, the political, and the divine.',
    '> CAPABILITY: Advanced RAG-LLM agent with access to complete archive.',
    '> PURPOSE: Democratizing access to hidden knowledge.',
    '> WARNING: This system enables direct interaction with historically restricted texts.',
    '> ADVISORY: Knowledge previously gatekept by secret societies is now accessible.',
    '> NOTE: All source material is unverified. The truth is yours to decipher.'
  ].join('\n');

  const secondModalText = [
    'So much of the world\'s knowledge is hidden - from \'lost\' books of the Bible, to medieval manuals on witchcraft, to previously-classified government documents.',
    '',
    'The esoteric.ai team has spent years compiling these, from every source possible. Our private archive is now larger than the entirety of Wikipedia, and growing every day.',
    '',
    'We are currently providing public access to our archive via an LLM with RAG capability.',
    '',
    'Our end-goal is to let everyone browse and chat with our full database - to summon an omniscient machine mind, if you will.',
    '',
    'Don\'t know where to begin your research? Every 24 hours, a new starting point will be summoned to serve as inspiration.'
  ].join('\n');

  useEffect(() => {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    
    const time = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const shortDate = now.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '.');
    
    setFormattedDate(date);
    setFormattedTime(time);
    setTimestamp(`[${shortDate} ${time}]`);

    // Select revelation based on days since February 17th, 2025
    const startDate = new Date(2025, 1, 17); // February 17th, 2025
    const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Find the index in the revelations array
    // Start with index 0 (revelation 371) and cycle through
    const revelationIndex = ((daysSinceStart % revelations.length) + revelations.length) % revelations.length;
    setCurrentRevelation(revelations[revelationIndex]);

    const hasSeenLanding = localStorage.getItem('hasSeenLanding');
    if (hasSeenLanding) {
      setShowLandingModal(false);
    } else {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setTypedText(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          setTimeout(() => setShowButton(true), 500);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (showSecondModal) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < secondModalText.length) {
          setTypedSecondText(secondModalText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          setTimeout(() => setShowFinalButton(true), 500);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [showSecondModal]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(formatTimeUntilMidnight());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Auto-scroll chat to bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, loadingSteps]);

  const getTypedLines = () => {
    const lines = typedText.split('\n');
    const header = lines[0] || '';
    const title = lines[1] || '';
    const mainLines = lines.slice(2, 6);
    const warnings = lines.slice(6);
    
    return { header, title, mainLines, warnings, isComplete: typedText.length === fullText.length };
  };

  const handleFirstNext = () => {
    setShowSecondModal(true);
    setShowLandingModal(false);
  };

  const dismissLandingModal = () => {
    localStorage.setItem('hasSeenLanding', 'true');
    setShowLandingModal(false);
    setShowSecondModal(false);
  };

  const formatTimeUntilMidnight = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0); // Set to next midnight in local time
    const diff = tomorrow.getTime() - now.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Use local date instead of UTC
    return tomorrow.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleQuery = async () => {
    if (!queryText.trim()) return;
    
    // Add user message
    setChatMessages(prev => [...prev, { type: 'user', text: queryText }]);
    const userQuery = queryText;
    setQueryText('');
    setIsQuerying(true);
    setShowDemandMessage(false);
    setLoadingSteps([]);
    setIsError(false);
    shouldContinueLoadingRef.current = true;

    // Start loading steps immediately
    const baseLoadingSteps = [
      'Initializing archive connection...',
      'Accessing restricted manuscripts...',
      'Decrypting historical records...',
      'Cross-referencing source materials...',
      'Analyzing mystical correlations...',
      'Processing arcane knowledge...',
      'Consulting ancient grimoires...',
      'Verifying temporal alignments...',
      'Synthesizing patterns...',
    ];

    const failureSteps = [
      'Warning: Archive load exceeding capacity...',
      'Attempting failover protocols...',
      'ERROR: Archive access currently restricted'
    ];

    let currentStep = 0;
    const addNextStep = () => {
      if (!shouldContinueLoadingRef.current) return;

      // Add base steps
      if (currentStep < baseLoadingSteps.length) {
        setLoadingSteps(prev => [...prev, baseLoadingSteps[currentStep]]);
        currentStep++;
        // Random delay between 800ms and 2000ms for next step
        const nextDelay = 800 + Math.random() * 1200;
        loadingTimeoutRef.current = setTimeout(addNextStep, nextDelay);
        return;
      }

      // After base steps, start showing connection issues
      const failureStep = currentStep - baseLoadingSteps.length;
      if (failureStep < failureSteps.length) {
        // Longer delays for failure steps
        const failureDelay = 2000 + Math.random() * 1000;
        loadingTimeoutRef.current = setTimeout(() => {
          setLoadingSteps(prev => [...prev, failureSteps[failureStep]]);
          currentStep++;
          addNextStep();
        }, failureDelay);
      }
    };
    
    // Start the first step with a random delay
    loadingTimeoutRef.current = setTimeout(addNextStep, 800 + Math.random() * 1200);
    
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userQuery,
          context: "Pattern #371: The death of Pan coinciding with Christ's ministry",
        }),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      setChatMessages(prev => [...prev, { type: 'system', text: data.response }]);
    } catch (error) {
      console.error('Error querying archive:', error);
      setShowDemandMessage(true);
      setChatMessages(prev => [...prev, { 
        type: 'system', 
        text: '> ERROR: Archive access currently restricted due to high demand.\n\n> To receive a response when server capacity is available, please click <button class="text-white hover:text-gray-300 underline cursor-pointer">save</button> or check back later.'
      }]);
      setIsError(true);
    } finally {
      shouldContinueLoadingRef.current = false;
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      setIsQuerying(false);
      setLoadingSteps([]);
    }
  };

  const renderMessageContent = (message: { type: 'user' | 'system', text: string }) => {
    if (message.type === 'user') {
      return `> ${message.text}`;
    }
    // For system messages, look for the save button markup and replace it with a clickable element
    if (message.text.includes('class="text-white hover:text-gray-300 underline cursor-pointer"')) {
      return (
        <span 
          dangerouslySetInnerHTML={{ 
            __html: message.text.replace(
              /<button class="text-white hover:text-gray-300 underline cursor-pointer">save<\/button>/g,
              `<span class="text-white hover:text-gray-300 underline cursor-pointer" onclick="document.getElementById('save-button').click()">save</span>`
            )
          }} 
        />
      );
    }
    return message.text;
  };

  const handleSearchRelated = () => {
    if (!currentRevelation) return;
    setActiveTab('query');
    setQueryText(`Find content relating to:

${currentRevelation.title}

${currentRevelation.content}`);
  };

  const handleAccessSource = () => {
    if (!currentRevelation) return;
    setActiveTab('query');
    setQueryText(`Search archive for: ${currentRevelation.source}`);
  };

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  const showEmailModalWithSource = (source: 'daily' | 'current' | 'other' | 'query') => {
    setEmailModalSource(source);
    setShowEmailModal(true);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* First Landing Modal */}
      {showLandingModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50">
          <div className={`bg-gray-900/80 p-8 rounded-lg border border-gray-800 w-full max-w-xl relative backdrop-blur-sm transition-all duration-500 ${typedText ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="space-y-6">
              <div className={`font-mono text-xs text-gray-400 ${!getTypedLines().title ? 'typing-cursor' : ''}`}>
                {getTypedLines().header}
              </div>
              <div className={`font-serif text-xl text-white mb-6 leading-relaxed ${getTypedLines().mainLines.length === 0 ? 'typing-cursor' : ''}`}>
                {getTypedLines().title}
              </div>
              <div className="font-mono text-xs text-gray-300 leading-relaxed space-y-4">
                {getTypedLines().mainLines.map((line, index) => (
                  <p key={index} 
                     className={`transition-opacity duration-300 ${
                       index === getTypedLines().mainLines.length - 1 && 
                       getTypedLines().warnings.length === 0 ? 'typing-cursor' : ''
                     }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
              <div className="font-mono text-[10px] text-gray-500 mt-8 leading-relaxed">
                {getTypedLines().warnings.map((warning, index) => (
                  <div key={index} 
                       className={`transition-opacity duration-300 ${
                         index === getTypedLines().warnings.length - 1 && 
                         !getTypedLines().isComplete ? 'typing-cursor' : ''
                       }`}
                  >
                    {warning}
                  </div>
                ))}
              </div>
              {showButton && (
                <div className="flex items-center space-x-4 mt-6">
                  <button 
                    onClick={handleFirstNext}
                    className="px-4 py-3 border border-gray-700 bg-gray-900/50 hover:bg-gray-900 transition-all font-mono text-xs text-gray-300 hover:text-white opacity-0 animate-fade-in rounded hover:border-gray-600 shadow-sm"
                  >
                    i
                  </button>
                  <button 
                    onClick={dismissLandingModal}
                    className="flex-1 border border-gray-700 bg-gray-900/50 hover:bg-gray-900 transition-all py-3 font-mono text-xs text-gray-300 hover:text-white opacity-0 animate-fade-in hover:border-gray-600 shadow-sm"
                  >
                    &gt; RUN
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Second Modal (Info) */}
      {showSecondModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50">
          <div className={`bg-gray-900/80 p-8 rounded-lg border border-gray-800 w-full max-w-xl relative backdrop-blur-sm transition-all duration-500 ${typedSecondText ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="space-y-6">
              <div className="font-mono text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                {typedSecondText}
                <span className={!showFinalButton ? 'typing-cursor' : ''}></span>
              </div>
              {showFinalButton && (
                <div className="flex justify-end">
                  <button 
                    onClick={dismissLandingModal}
                    className="w-32 mt-6 border border-gray-700 bg-gray-900/50 hover:bg-gray-900 transition-all py-3 font-mono text-xs text-gray-300 hover:text-white opacity-0 animate-fade-in hover:border-gray-600 shadow-sm"
                  >
                    &gt; RUN
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 p-6 pb-24">
        {/* Header */}
        <div className="font-mono mb-12">
          <div className="text-xs text-gray-500 mb-2">
            {timestamp}
          </div>
          <div className="text-xl text-gray-300 font-mono tracking-wide">
            esoteric.ai
          </div>
        </div>

        {/* Daily Pattern Section */}
        {activeTab === 'today' && currentRevelation && (
          <div className="mb-8 animate-fade-in">
            {/* Log Entry Header */}
            <div className="font-mono mb-12">
              <div className="border-l-2 border-gray-800 pl-4 space-y-3">
                <div className="text-2xl text-gray-200 font-serif tracking-wide">
                  Daily Revelation for {formattedDate}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  &gt; Pattern #{currentRevelation.id}
                </div>
              </div>
            </div>

            {/* Main Pattern */}
            <div className="mb-16">
              <div className="relative font-serif text-2xl mb-8 leading-relaxed tracking-wide">
                {currentRevelation.title}
                
                <button 
                  onClick={() => setSaved(!saved)}
                  className="absolute -right-2 -top-2 p-2 text-gray-500 hover:text-white transition-colors"
                >
                  <span className="text-lg">{saved ? '🝞' : '🝢'}</span>
                </button>
              </div>
              
              <div className="font-mono space-y-6 leading-relaxed">
                <div className="text-sm leading-relaxed text-gray-300">
                  {currentRevelation.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <p className="border-l border-gray-800 pl-4 text-xs text-gray-500">
                  SOURCE: {currentRevelation.source}
                  <br/>
                  SIGNIFICANCE: {currentRevelation.significance}
                  <br/>
                  STATUS: {currentRevelation.status}
                </p>
              </div>
            </div>

            {/* Source Links */}
            <div className="font-mono text-xs space-y-2 mb-12">
              <div 
                onClick={handleAccessSource}
                className="text-white hover:text-gray-300 cursor-pointer transition-colors"
              >
                &gt; Access primary source
              </div>
              <div className="text-gray-600">
                &gt; Note: texts provided for research purposes only
              </div>
            </div>

            {/* Bottom Section with Search and Next Pattern */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {/* Left Column - Search */}
              <div className="font-mono text-xs">
                <button
                  onClick={handleSearchRelated}
                  className="w-full border border-gray-700 bg-gray-900/30 hover:bg-gray-800/50 transition-all duration-300 rounded-lg text-left hover:border-gray-500 hover:scale-[1.02] transform"
                >
                  <div className="p-4 flex flex-col">
                    <div className="text-white font-mono text-sm font-bold tracking-wider mb-2"><span className="mr-2">ᛝ</span>SEARCH RELATED TEXTS</div>
                    <div className="text-white space-y-4 mt-3">
                      &gt; search our archive for related documents
                      <br/><br/>&gt; chat with our AI about what you find, and new avenues of investigation
                      <br/><br/>&gt; save and download all documents returned by any search
                    </div>
                  </div>
                </button>
              </div>

              {/* Right Column - Next Pattern */}
              <div className="font-mono text-xs">
                <button
                  onClick={() => showEmailModalWithSource('daily')}
                  className="w-full bg-gray-900/30 rounded-lg border border-gray-800 text-left hover:bg-gray-800/50 transition-all duration-300 hover:border-gray-500 hover:scale-[1.02] transform"
                >
                  <div className="p-4 flex flex-col">
                    <div className="text-white font-mono text-sm font-bold tracking-wider mb-2"><span className="mr-2">ᛝ</span>NEXT REVELATION</div>
                    <div className="text-white space-y-4 mt-3">
                      &gt; scheduled for {getTomorrowDate()} [00:00 Local]
                      <br/><br/>&gt; temporal gateway opens in {countdown}
                      <br/><br/>&gt; <span className="underline">click here</span> to subscribe to the daily revelation
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Query Interface */}
        {activeTab === 'query' && (
          <div className="fixed inset-x-0 top-[140px] bottom-[72px] px-6 animate-fade-in">
            <div className="h-full bg-gray-900/30 rounded-lg border border-gray-800 p-4 flex flex-col">
              <div 
                ref={chatContainerRef}
                className="flex-1 space-y-4 overflow-y-auto font-mono scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent"
              >
                {(chatMessages.length > 0 || loadingSteps.length > 0) && (
                  <>
                    {chatMessages.map((message, index) => (
                      <div key={index} className={`${message.type === 'user' ? 'text-right' : ''}`}>
                        <div className={`inline-block text-xs ${
                          message.type === 'user' 
                            ? 'bg-gray-800/50 text-white' 
                            : 'bg-gray-900/50 text-gray-400'
                          } p-3 rounded-lg max-w-[80%] whitespace-pre-line font-mono`}>
                          {renderMessageContent(message)}
                        </div>
                      </div>
                    ))}
                    {loadingSteps.map((step, index) => (
                      <div key={`loading-${index}`} className="text-xs text-gray-400">
                        <div className="animate-pulse font-mono">
                          &gt; {step}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div className="flex space-x-2 mt-4">
                <textarea 
                  className="flex-1 bg-black/50 border border-gray-800 rounded px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gray-700 font-mono min-h-[38px] resize-none overflow-hidden"
                  placeholder="Type your query here..."
                  value={queryText}
                  onChange={(e) => {
                    setQueryText(e.target.value);
                    adjustTextareaHeight(e.target);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && !isQuerying) {
                      e.preventDefault();
                      handleQuery();
                    }
                  }}
                  disabled={isQuerying}
                  rows={1}
                  ref={(el) => {
                    if (el) {
                      adjustTextareaHeight(el);
                    }
                  }}
                />
                <button 
                  onClick={() => showEmailModalWithSource('query')}
                  className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded text-xs text-white hover:bg-gray-900 transition-all font-mono h-[38px] whitespace-nowrap"
                >
                  {saved ? 'Saved' : 'Save'}
                </button>
                <button 
                  onClick={handleQuery}
                  className={`px-4 py-2 bg-gray-900/50 border border-gray-800 rounded text-xs text-white hover:bg-gray-900 transition-all font-mono ${isQuerying ? 'opacity-50 cursor-not-allowed' : ''} h-[38px] whitespace-nowrap`}
                  disabled={isQuerying}
                >
                  {isQuerying ? 'Processing...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Saved Tab */}
        {activeTab === 'saved' && (
          <div className="fixed inset-x-0 top-[140px] bottom-[72px] px-6 animate-fade-in flex items-center justify-center">
            <button
              onClick={() => showEmailModalWithSource('other')}
              className="font-mono text-xs text-white hover:text-gray-200 transition-colors text-center"
            >
              coming soon
              <br />-<br />
              <span className="underline">get notified when available</span>
            </button>
          </div>
        )}

        {/* Save Button - Only show on non-query tabs */}
        {activeTab !== 'query' && (
          <div className="fixed bottom-32 right-6">
            <button 
              id="save-button"
              onClick={() => showEmailModalWithSource('current')}
              className="group flex flex-col items-center space-y-1 bg-gray-900/50 px-6 py-3 rounded-lg border border-gray-800 hover:bg-gray-900/80 transition-all shadow-lg"
            >
              <span className="text-2xl text-gray-400 group-hover:text-white transition-colors">
                {saved ? 'ᛯ' : 'ᛨ'}
              </span>
              <span className="font-mono text-[10px] text-gray-500 group-hover:text-gray-300">
                {saved ? 'SAVED' : 'SAVE'}
              </span>
            </button>
          </div>
        )}

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 w-full max-w-md relative">
              <button 
                onClick={() => setShowEmailModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white font-mono"
              >
                ✕
              </button>
              <div className="space-y-6">
                {emailModalSource === 'daily' ? (
                  <>
                    <div className="font-mono text-xs text-gray-400">
                      &gt; DAILY REVELATION SUBSCRIPTION
                    </div>
                    <iframe
                      src="YOUR_SUBSTACK_EMBED_URL"
                      width="100%"
                      height="320"
                      style={{ border: '0px', background: 'transparent' }}
                      frameBorder="0"
                      scrolling="no"
                      className="mt-4"
                    ></iframe>
                  </>
                ) : emailModalSource === 'current' ? (
                  <>
                    <div className="font-mono text-xs text-gray-400">
                      &gt; DAILY REVELATION #371 ARCHIVAL REQUEST
                    </div>
                    <iframe
                      src="YOUR_SUBSTACK_EMBED_URL"
                      width="100%"
                      height="320"
                      style={{ border: '0px', background: 'transparent' }}
                      frameBorder="0"
                      scrolling="no"
                      className="mt-4"
                    ></iframe>
                  </>
                ) : emailModalSource === 'query' ? (
                  <>
                    <div className="font-mono text-xs text-gray-400">
                      &gt; ARCHIVE QUERY RESPONSE REQUEST
                    </div>
                    <div className="font-mono text-xs text-gray-500 leading-relaxed mt-4">
                      &gt; your query will be processed when server load permits
                      <br/>&gt; results will be transmitted via secure channel
                    </div>
                    <iframe
                      src="YOUR_SUBSTACK_EMBED_URL"
                      width="100%"
                      height="320"
                      style={{ border: '0px', background: 'transparent' }}
                      frameBorder="0"
                      scrolling="no"
                      className="mt-4"
                    ></iframe>
                  </>
                ) : (
                  <>
                    <div className="font-mono text-xs text-gray-400">
                      &gt; PATTERN ARCHIVAL REQUEST
                    </div>
                    <div className="font-mono text-xs text-gray-500 leading-relaxed">
                      &gt; initiating temporal bridge
                      <br/>&gt; preparing daily transmission
                      <br/>&gt; awaiting contact signal...
                    </div>
                    <div className="font-mono text-[10px] text-gray-600 mt-4">
                      &gt; Note: Your email will be used to establish a secure channel for pattern transmission.
                      <br/>&gt; Transmission frequency: Daily [0000-2359 UTC]
                      <br/>&gt; Protocol: Secure, Unmonitored, Discrete
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-black">
        <div className="p-4">
          <div className="flex justify-around items-center">
            <button 
              onClick={() => setActiveTab('today')}
              className={`flex flex-col items-center space-y-1 group ${activeTab === 'today' ? 'text-white' : ''}`}
            >
              <span className="text-lg group-hover:text-gray-300 transition-colors">ᛦ</span>
              <span className="font-mono text-[10px] text-gray-400 group-hover:text-gray-300">TODAY</span>
            </button>
            <button 
              onClick={() => setActiveTab('query')}
              className={`flex flex-col items-center space-y-1 group ${activeTab === 'query' ? 'text-white' : ''}`}
            >
              <span className="text-lg group-hover:text-gray-300 transition-colors">ᛟ</span>
              <span className="font-mono text-[10px] text-gray-400 group-hover:text-gray-300">QUERY</span>
            </button>
            <button 
              onClick={() => setActiveTab('saved')}
              className={`flex flex-col items-center space-y-1 group ${activeTab === 'saved' ? 'text-white' : ''}`}
            >
              <span className="text-lg group-hover:text-gray-300 transition-colors">ᛸ</span>
              <span className="font-mono text-[10px] text-gray-400 group-hover:text-gray-300">SAVED</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyPattern; 