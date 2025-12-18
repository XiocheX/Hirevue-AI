
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { encode, decode, decodeAudioData } from '../services/geminiService';

const InterviewCoach: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcriptions, setTranscriptions] = useState<{role: string, text: string}[]>([]);
  const [status, setStatus] = useState('Idle');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const inputTranscriptionRef = useRef('');
  const outputTranscriptionRef = useRef('');

  const stopConversation = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setIsActive(false);
    setStatus('Finished');
  }, []);

  const startConversation = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      // Setup audio contexts
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      if (!outAudioContextRef.current) outAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      setStatus('Connecting...');
      setIsActive(true);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setStatus('Speaking...');
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };

              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcription
            if (message.serverContent?.outputTranscription) {
              outputTranscriptionRef.current += message.serverContent.outputTranscription.text;
            } else if (message.serverContent?.inputTranscription) {
              inputTranscriptionRef.current += message.serverContent.inputTranscription.text;
            }

            if (message.serverContent?.turnComplete) {
              const userText = inputTranscriptionRef.current;
              const modelText = outputTranscriptionRef.current;
              if (userText) setTranscriptions(prev => [...prev, {role: 'You', text: userText}]);
              if (modelText) setTranscriptions(prev => [...prev, {role: 'Coach', text: modelText}]);
              inputTranscriptionRef.current = '';
              outputTranscriptionRef.current = '';
            }

            // Handle Audio
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outAudioContextRef.current) {
              const ctx = outAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error(e);
            stopConversation();
          },
          onclose: () => stopConversation()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          systemInstruction: "You are a professional technical interviewer. Ask challenging but fair coding and system design questions. Provide constructive feedback after each answer.",
          inputAudioTranscription: {},
          outputAudioTranscription: {}
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Error starting session');
      setIsActive(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-10 duration-700">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Voice <span className="gradient-text">Interview Coach</span></h2>
        <p className="text-slate-400">Practice your soft skills and technical explanations with real-time audio feedback.</p>
      </div>

      <div className="glass rounded-3xl p-12 border border-white/10 flex flex-col items-center justify-center space-y-8 shadow-2xl relative overflow-hidden">
        {isActive && (
          <div className="absolute inset-0 bg-indigo-500/10 animate-pulse pointer-events-none"></div>
        )}
        
        <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
          isActive ? 'bg-indigo-600 scale-110 shadow-[0_0_50px_rgba(79,70,229,0.5)]' : 'bg-slate-800'
        }`}>
          <svg className={`w-12 h-12 ${isActive ? 'text-white' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
          </svg>
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold text-slate-200 mb-2">{status}</p>
          <p className="text-xs text-slate-500 uppercase tracking-widest">
            {isActive ? 'Coach is listening...' : 'Ready to start?'}
          </p>
        </div>

        <button
          onClick={isActive ? stopConversation : startConversation}
          className={`px-12 py-4 rounded-full font-bold text-lg shadow-xl transition-all ${
            isActive 
              ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {isActive ? 'End Session' : 'Start Mock Interview'}
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-300 px-2">Transcription History</h3>
        <div className="glass rounded-2xl border border-white/5 h-64 overflow-y-auto p-6 space-y-4">
          {transcriptions.length === 0 ? (
            <p className="text-slate-600 text-center py-12 text-sm italic">No conversation yet. Click start to begin.</p>
          ) : (
            transcriptions.map((t, i) => (
              <div key={i} className={`flex flex-col ${t.role === 'You' ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t.role}</span>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                  t.role === 'You' ? 'bg-indigo-600/20 text-indigo-100 rounded-tr-none' : 'bg-slate-800 text-slate-300 rounded-tl-none'
                }`}>
                  {t.text}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewCoach;
