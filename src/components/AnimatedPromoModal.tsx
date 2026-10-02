import React, { useState, useEffect, useRef } from 'react';
import { Drama } from '../types/drama';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Download,
  Film,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Smartphone,
  Monitor,
  Heart,
  ChevronUp
} from 'lucide-react';

interface AnimatedPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  dramas: Drama[];
  onToast: (msg: string) => void;
}

export const AnimatedPromoModal: React.FC<AnimatedPromoModalProps> = ({
  isOpen,
  onClose,
  dramas,
  onToast
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordProgress, setRecordProgress] = useState<number>(0);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'video' | 'material'>('video');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);

  const TOTAL_DURATION = 24; // 24 seconds total promo

  const scenes = [
    { title: 'Branding Hook', start: 0, end: 5.5, label: '01. Logo Reveal' },
    { title: 'Poster Showcase', start: 5.5, end: 12.5, label: '02. Poster Art' },
    { title: 'Portrait Player', start: 12.5, end: 18.5, label: '03. Player Gestures' },
    { title: 'Call To Action', start: 18.5, end: 24, label: '04. VIP CTA' }
  ];

  // Preload images into memory for smooth Canvas rendering
  useEffect(() => {
    if (!isOpen) return;

    const imgElements: HTMLImageElement[] = [];
    dramas.forEach((drama) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = drama.coverImage;
      imgElements.push(img);
    });
    loadedImagesRef.current = imgElements;
  }, [isOpen, dramas]);

  // Web Audio cinematic synth beats & risers
  const playSoundEffect = (type: 'bass' | 'cymbal' | 'whoosh' | 'heartbeat' | 'chime') => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'bass') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.8);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.9);
      } else if (type === 'heartbeat') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'whoosh') {
        // Noise buffer
        const bufferSize = ctx.sampleRate * 0.4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(1800, now + 0.35);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
        noise.stop(now + 0.35);
      } else if (type === 'chime') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.1); // A5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Sound triggers at scene transitions
  const lastTriggeredScene = useRef<number>(-1);
  useEffect(() => {
    if (currentSceneIndex !== lastTriggeredScene.current) {
      lastTriggeredScene.current = currentSceneIndex;
      if (currentSceneIndex === 0) playSoundEffect('bass');
      if (currentSceneIndex === 1) playSoundEffect('whoosh');
      if (currentSceneIndex === 2) playSoundEffect('heartbeat');
      if (currentSceneIndex === 3) playSoundEffect('chime');
    }
  }, [currentSceneIndex]);

  // Canvas Animation Render Engine
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    startTimeRef.current = performance.now() - playbackTime * 1000;

    const render = (time: number) => {
      if (isPlaying) {
        const elapsed = (time - startTimeRef.current) / 1000;
        const currentT = elapsed % TOTAL_DURATION;
        setPlaybackTime(currentT);

        // Determine current scene
        const scIdx = scenes.findIndex((s) => currentT >= s.start && currentT < s.end);
        if (scIdx !== -1 && scIdx !== currentSceneIndex) {
          setCurrentSceneIndex(scIdx);
        }

        const width = (canvas.width = aspectRatio === '9:16' ? 540 : 960);
        const height = (canvas.height = aspectRatio === '9:16' ? 960 : 540);

        // Clear canvas
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, width, height);

        // ==========================================
        // SCENE 1: BRANDING HOOK (0s - 5.5s)
        // ==========================================
        if (currentT < 5.5) {
          const t = currentT;
          // Background ambient gradient
          const grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width);
          grad.addColorStop(0, '#3b0712');
          grad.addColorStop(0.6, '#0f172a');
          grad.addColorStop(1, '#020617');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);

          // Grid lines animation
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)';
          ctx.lineWidth = 1;
          const gridOffset = (t * 40) % 60;
          for (let y = gridOffset; y < height; y += 60) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
          }

          // Glowing logo lockup
          ctx.save();
          ctx.translate(width / 2, height / 2 - 30);
          const scale = Math.min(1.2, 0.6 + t * 0.15);
          ctx.scale(scale, scale);

          // Crimson glow
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 35 + Math.sin(t * 4) * 15;

          // DramaBox Title
          ctx.font = '900 48px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#ef4444';
          ctx.fillText('DRAMA', -55, 0);
          ctx.fillStyle = '#ffffff';
          ctx.fillText('BOX', 75, 0);

          ctx.restore();

          // Subtitle / Tagline
          ctx.save();
          ctx.font = '700 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = '#fca5a5';
          ctx.letterSpacing = '4px';
          ctx.fillText('THE NEXT-GEN VERTICAL DRAMA PLATFORM', width / 2, height / 2 + 50);
          ctx.letterSpacing = '0px';

          ctx.font = '500 13px sans-serif';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText('Billionaires · Werewolf Kings · High-Society Revenge', width / 2, height / 2 + 85);
          ctx.restore();
        }

        // ==========================================
        // SCENE 2: POSTER ART SHOWCASE (5.5s - 12.5s)
        // ==========================================
        else if (currentT >= 5.5 && currentT < 12.5) {
          const t = currentT - 5.5; // 0 to 7 seconds
          const dramaIndex = Math.min(
            loadedImagesRef.current.length - 1,
            Math.floor((t / 7) * loadedImagesRef.current.length)
          );
          const currentImg = loadedImagesRef.current[dramaIndex];
          const dramaData = dramas[dramaIndex] || dramas[0];

          // Dark cinematic vignette
          ctx.fillStyle = '#050914';
          ctx.fillRect(0, 0, width, height);

          if (currentImg && currentImg.complete) {
            // Blurred background cover
            ctx.save();
            ctx.filter = 'blur(16px) brightness(0.35)';
            ctx.drawImage(currentImg, -50, -50, width + 100, height + 100);
            ctx.restore();

            // Main 3D Card swooping in
            const cardW = width * 0.52;
            const cardH = cardW * (4 / 3);
            const cardX = (width - cardW) / 2;
            const cardY = height * 0.22;

            ctx.save();
            // Drop shadow
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowBlur = 30;
            ctx.shadowOffsetY = 15;

            // Draw rounded poster
            ctx.beginPath();
            ctx.roundRect(cardX, cardY, cardW, cardH, 20);
            ctx.clip();
            ctx.drawImage(currentImg, cardX, cardY, cardW, cardH);
            ctx.restore();
          }

          // Overlay Title & Badge
          ctx.save();
          ctx.textAlign = 'center';

          // Category badge
          ctx.font = '800 13px sans-serif';
          ctx.fillStyle = '#ef4444';
          ctx.fillText(dramaData.category.toUpperCase(), width / 2, height * 0.75);

          // Drama Title
          ctx.font = '900 24px sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 10;
          ctx.fillText(dramaData.title, width / 2, height * 0.8);

          // Episode count & views
          ctx.font = '500 14px sans-serif';
          ctx.fillStyle = '#cbd5e1';
          ctx.fillText(`${dramaData.totalEpisodes} Episodes · ${dramaData.views} Views`, width / 2, height * 0.85);

          ctx.restore();
        }

        // ==========================================
        // SCENE 3: PORTRAIT PLAYER GESTURES (12.5s - 18.5s)
        // ==========================================
        else if (currentT >= 12.5 && currentT < 18.5) {
          const t = currentT - 12.5; // 0 to 6 seconds
          const phoneW = width * 0.62;
          const phoneH = phoneW * (16 / 9);
          const phoneX = (width - phoneW) / 2;
          const phoneY = (height - phoneH) / 2 + 10;

          // Backdrop
          ctx.fillStyle = '#020617';
          ctx.fillRect(0, 0, width, height);

          // Phone Chassis
          ctx.save();
          ctx.shadowColor = 'rgba(239, 68, 68, 0.3)';
          ctx.shadowBlur = 40;
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.roundRect(phoneX, phoneY, phoneW, phoneH, 32);
          ctx.fill();
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 4;
          ctx.stroke();
          ctx.restore();

          // Phone screen clipping
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(phoneX + 4, phoneY + 4, phoneW - 8, phoneH - 8, 28);
          ctx.clip();

          // Display video poster inside phone
          const poster = loadedImagesRef.current[0];
          if (poster && poster.complete) {
            ctx.drawImage(poster, phoneX + 4, phoneY + 4, phoneW - 8, phoneH - 8);
          }

          // Dark gradient overlay
          const pGrad = ctx.createLinearGradient(0, phoneY, 0, phoneY + phoneH);
          pGrad.addColorStop(0, 'rgba(0,0,0,0.6)');
          pGrad.addColorStop(0.5, 'transparent');
          pGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
          ctx.fillStyle = pGrad;
          ctx.fillRect(phoneX + 4, phoneY + 4, phoneW - 8, phoneH - 8);

          // Simulated Action Rail
          const railX = phoneX + phoneW - 28;
          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('❤️ 184k', railX, phoneY + phoneH * 0.6);
          ctx.fillText('💬 3.4k', railX, phoneY + phoneH * 0.72);
          ctx.fillText('🔖 Saved', railX, phoneY + phoneH * 0.84);

          // Animated gesture hand icon
          const swipeOffset = Math.sin(t * 3) * 35;
          ctx.font = '28px sans-serif';
          ctx.fillText('👆', phoneX + phoneW / 2, phoneY + phoneH / 2 + swipeOffset);

          // Floating double-tap heart
          if (t > 2 && t < 4) {
            ctx.font = '32px sans-serif';
            ctx.fillText('💖', phoneX + phoneW / 2, phoneY + phoneH / 2 - 40);
          }

          ctx.restore();

          // Feature Banner
          ctx.save();
          ctx.font = '800 18px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = '#ef4444';
          ctx.fillText('GESTURE-BASED VERTICAL PLAYER', width / 2, height * 0.1);
          ctx.font = '500 13px sans-serif';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText('Swipe Up for Next Ep · Double Tap to Like', width / 2, height * 0.1 + 24);
          ctx.restore();
        }

        // ==========================================
        // SCENE 4: CALL TO ACTION (18.5s - 24s)
        // ==========================================
        else {
          const t = currentT - 18.5; // 0 to 5.5 seconds

          const grad = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, width * 0.8);
          grad.addColorStop(0, '#450a0a');
          grad.addColorStop(0.7, '#020617');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);

          // Sparkles / particles
          ctx.fillStyle = 'rgba(245, 158, 11, 0.4)';
          for (let i = 0; i < 20; i++) {
            const x = (Math.sin(t * 1.5 + i * 2) * 0.5 + 0.5) * width;
            const y = ((t * 80 + i * 50) % height);
            ctx.beginPath();
            ctx.arc(x, y, (i % 3) + 2, 0, Math.PI * 2);
            ctx.fill();
          }

          // Header
          ctx.save();
          ctx.textAlign = 'center';
          ctx.font = '900 32px sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('START STREAMING NOW', width / 2, height * 0.35);

          ctx.font = '700 16px sans-serif';
          ctx.fillStyle = '#f59e0b';
          ctx.fillText('CLAIM 3-DAY FREE VIP TRIAL', width / 2, height * 0.42);

          // Big Red Button Graphic
          const btnW = 240;
          const btnH = 50;
          const btnX = (width - btnW) / 2;
          const btnY = height * 0.5;

          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 25;
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.roundRect(btnX, btnY, btnW, btnH, 25);
          ctx.fill();

          ctx.shadowBlur = 0;
          ctx.font = 'bold 16px sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText('WATCH ON DRAMABOX', width / 2, btnY + 31);

          // DramaBox Logo Footer
          ctx.font = '900 22px sans-serif';
          ctx.fillStyle = '#ef4444';
          ctx.fillText('DRAMA', width / 2 - 25, height * 0.72);
          ctx.fillStyle = '#ffffff';
          ctx.fillText('BOX', width / 2 + 35, height * 0.72);

          ctx.font = '400 12px sans-serif';
          ctx.fillStyle = '#64748b';
          ctx.fillText('Available in Web & Mobile PWA', width / 2, height * 0.77);
          ctx.restore();
        }

        // Progress bar along bottom
        const progressWidth = (currentT / TOTAL_DURATION) * width;
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(0, height - 6, progressWidth, 6);
      }

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isOpen, isPlaying, aspectRatio, dramas, currentSceneIndex]);

  // Video recording function
  const handleStartRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const stream = canvas.captureStream(30);
      recordedChunksRef.current = [];

      const options = { mimeType: 'video/webm;codecs=vp9' };
      const recorder = new MediaRecorder(stream, options);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DramaBox_Animated_Promo_${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsRecording(false);
        onToast('Promo video recorded and downloaded! 🎬');
      };

      recorder.start();
      setIsRecording(true);
      setPlaybackTime(0);
      startTimeRef.current = performance.now();
      setIsPlaying(true);
      onToast('Recording 24s promo video...');

      // Record for complete 24 seconds
      let p = 0;
      const interval = setInterval(() => {
        p += 1;
        setRecordProgress(Math.min(100, Math.round((p / TOTAL_DURATION) * 100)));
        if (p >= TOTAL_DURATION) {
          clearInterval(interval);
          recorder.stop();
        }
      }, 1000);
    } catch {
      onToast('MediaRecorder not supported on this device. You can preview in real-time!');
      setIsRecording(false);
    }
  };

  const handleSeekScene = (sceneStart: number) => {
    setPlaybackTime(sceneStart);
    startTimeRef.current = performance.now() - sceneStart * 1000;
  };

  const handleCopyScript = () => {
    const script = `🎬 DRAMABOX SHORT DRAMA - ANIMATED PROMO SCRIPT
=====================================================
[SCENE 1: HOOK (0:00 - 0:05)]
Visual: High-impact DRAMABOX crimson neon logo explosion with particle grid.
Voiceover / Text: "Tired of boring 2-hour movies? Welcome to DramaBox — where every episode ends on a jaw-dropping cliffhanger."

[SCENE 2: POSTER ART & GENRE HOOKS (0:05 - 0:12)]
Visual: 3D perspective cards swooping in:
- "The Secret Billionaire Heir" (24.8M Views)
- "Revenge of the Disowned Heiress" (19.4M Views)
- "Alpha's Destined Mate" (16.7M Views)
Voiceover / Text: "Billionaires disguised as janitors. Betrayed heiresses claiming dynasties. Fated werewolf alphas. Over 500+ addictive mini-series streaming now."

[SCENE 3: PORTRAIT PLAYER GESTURES (0:12 - 0:18)]
Visual: Mobile frame mockup showing vertical 9:16 player. Hand icon swipes up to instantly skip to next episode, heart bursts explode on double-tap.
Voiceover / Text: "Built 100% for your phone. Seamless gesture controls, multi-language subtitles, and zero waiting."

[SCENE 4: CALL TO ACTION (0:18 - 0:24)]
Visual: VIP Crown badge and coin shower. CTA button: 'WATCH ON DRAMABOX'.
Voiceover / Text: "Claim your 3-Day Free VIP Trial and start bingeing all episodes today on DramaBox!"`;

    navigator.clipboard?.writeText(script);
    setCopiedScript(true);
    onToast('Promo video script copied to clipboard!');
    setTimeout(() => setCopiedScript(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Main Studio Modal */}
      <div className="relative z-10 w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-white animate-fade-in my-auto">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-red-500" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              Animated Promo Video & Marketing Kit
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="flex items-center p-0.5 rounded-lg bg-white/5 border border-white/10 text-xs">
              <button
                onClick={() => setActiveTab('video')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'video' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Animated Video
              </button>
              <button
                onClick={() => setActiveTab('material')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'material' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Promo Material & Script
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'video' ? (
            <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start justify-center">
              {/* Animated Canvas Player */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`relative rounded-2xl overflow-hidden bg-black border-2 border-slate-800 shadow-2xl ${
                    aspectRatio === '9:16'
                      ? 'w-[280px] sm:w-[320px] aspect-[9/16]'
                      : 'w-full max-w-[540px] aspect-[16/9]'
                  }`}
                >
                  <canvas ref={canvasRef} className="w-full h-full object-contain" />

                  {/* Watermark badge */}
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-red-400 flex items-center gap-1 pointer-events-none">
                    <Sparkles className="w-3 h-3 text-red-500" />
                    <span>DRAMABOX PROMO</span>
                  </div>

                  {/* Recording indicator */}
                  {isRecording && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center gap-1.5 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      <span>REC {recordProgress}%</span>
                    </div>
                  )}
                </div>

                {/* Scrubber & Controls below canvas */}
                <div className="w-full max-w-[320px] mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono">{playbackTime.toFixed(1)}s</span>
                    <span className="font-semibold text-white">
                      {scenes[currentSceneIndex]?.title}
                    </span>
                    <span className="font-mono">{TOTAL_DURATION}s</span>
                  </div>

                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${(playbackTime / TOTAL_DURATION) * 100}%` }}
                      className="h-full bg-red-600"
                    />
                  </div>

                  {/* Playback Button Toolbar */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPlaying((prev) => !prev)}
                        className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                      </button>

                      <button
                        onClick={() => {
                          setPlaybackTime(0);
                          startTimeRef.current = performance.now();
                          setIsPlaying(true);
                        }}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center transition-colors"
                        title="Replay from start"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setIsMuted((prev) => !prev)}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 flex items-center justify-center transition-colors"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Aspect Ratio Switch */}
                    <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/5 border border-white/5 text-[11px]">
                      <button
                        onClick={() => setAspectRatio('9:16')}
                        className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                          aspectRatio === '9:16' ? 'bg-red-600 text-white font-bold' : 'text-slate-400'
                        }`}
                      >
                        <Smartphone className="w-3 h-3" />
                        <span>9:16</span>
                      </button>
                      <button
                        onClick={() => setAspectRatio('16:9')}
                        className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                          aspectRatio === '16:9' ? 'bg-red-600 text-white font-bold' : 'text-slate-400'
                        }`}
                      >
                        <Monitor className="w-3 h-3" />
                        <span>16:9</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Director Side Panel */}
              <div className="flex-1 w-full space-y-4">
                {/* Scene Timeline Jumper */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                    Promo Scenes & Storyboard
                  </h3>
                  <div className="space-y-1.5">
                    {scenes.map((sc, i) => (
                      <button
                        key={sc.title}
                        onClick={() => handleSeekScene(sc.start)}
                        className={`w-full p-2.5 rounded-lg flex items-center justify-between text-xs transition-colors text-left ${
                          currentSceneIndex === i
                            ? 'bg-red-600/20 border border-red-500/50 text-white font-semibold'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-mono">
                            {i + 1}
                          </span>
                          <span>{sc.title}</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {sc.start}s – {sc.end}s
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Export & Recording Action Card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-red-950/40 via-slate-900 to-amber-950/20 border border-red-500/30">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-red-400" />
                    <span>Export Animated Promo Video</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Records the 24-second animated video directly from canvas at 30 FPS into a downloadable WebM video file for TikTok, YouTube Shorts, or Instagram Reels.
                  </p>
                  <button
                    onClick={handleStartRecording}
                    disabled={isRecording}
                    className="mt-3 w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    {isRecording ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Recording Video ({recordProgress}%)...</span>
                      </>
                    ) : (
                      <>
                        <Film className="w-4 h-4" />
                        <span>Record & Download Promo Video (.webm)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Promo Material & Ad Copy Kit */
            <div className="space-y-6">
              {/* Viral Ad Scripts */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Viral Video Ad Script (TikTok / Reels / Shorts)</span>
                  </h3>
                  <button
                    onClick={handleCopyScript}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copiedScript ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Script</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-3 text-xs text-slate-300 font-mono bg-black/40 p-4 rounded-lg border border-white/5 leading-relaxed">
                  <p className="text-red-400 font-bold"># Scene 1 (0:00 - 0:05) - The Curiosity Hook</p>
                  <p>&quot;You think he&apos;s just an ordinary security guard? Wait till his real identity is revealed in front of his arrogant ex-fiancée...&quot;</p>

                  <p className="text-red-400 font-bold mt-2"># Scene 2 (0:05 - 0:12) - High-Stakes Tropes</p>
                  <p>&quot;Secret billionaires, disowned heiresses taking over Wall Street, and fated werewolf alphas. Over 500+ addictive mini-series streaming now.&quot;</p>

                  <p className="text-red-400 font-bold mt-2"># Scene 3 (0:12 - 0:18) - Portrait Player Experience</p>
                  <p>&quot;Vertical streaming made for your phone. Fast swipe skipping, instant bingeing, and zero waiting.&quot;</p>

                  <p className="text-red-400 font-bold mt-2"># Scene 4 (0:18 - 0:24) - High-Conversion CTA</p>
                  <p>&quot;Start streaming free today on DramaBox — no credit card needed!&quot;</p>
                </div>
              </div>

              {/* Existing Poster Art Assets Showcase */}
              <div>
                <h3 className="text-sm font-bold text-white mb-3">
                  Featured Poster Art Assets Included in Promo
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {dramas.map((drama) => (
                    <div key={drama.id} className="flex flex-col">
                      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-800 border border-white/10 relative shadow">
                        <img
                          src={drama.coverImage}
                          alt={drama.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-semibold text-white truncate mt-1.5">
                        {drama.title}
                      </span>
                      <span className="text-[11px] text-red-400 font-medium">
                        {drama.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
