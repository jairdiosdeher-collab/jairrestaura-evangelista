import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload, Play, Pause, Square, Download, Share2, Sparkles, Type,
  Music, Image as ImageIcon, Sliders, Cross, Sun, Move, ZoomIn,
  RotateCcw, Plus, Trash2, CheckCircle2, AlertCircle, Volume2,
  Film, FileImage, Wand2, Eye, Layers, RefreshCw, Zap, XCircle, Gauge
} from 'lucide-react';

// ============================================================================
// TIPOS E INTERFACES DEL ESTUDIO
// ============================================================================

type AspectRatioKey = '1:1' | '9:16' | '16:9';
type ResolutionKey = '720x720' | '1080x1080' | '720x1280' | '1080x1920' | '1920x1080';
type ExportPresetMode = 'fast' | 'recommended' | 'professional';
type CameraMode = 'cinematic-in' | 'progressive-zoom' | 'smooth-out' | 'pan-sweep' | 'depth-3d' | 'static';
type TextAnimEffect = 'gold-shine' | 'fade-in' | 'glow-pulse' | 'fade-out-end' | 'none';
type ExportFormat = 'mp4' | 'webm' | 'gif' | 'png';
type ExportQuality = 'standard' | 'high' | 'max';

interface TextLayer {
  id: string;
  text: string;
  x: number; // Porcentaje 0-100
  y: number; // Porcentaje 0-100
  fontSize: number; // Escala relativa (20 - 110)
  color: 'gold' | 'white' | 'warm';
  effect: TextAnimEffect;
  visible: boolean;
}

interface CelestialEffects {
  rays: boolean;
  raysIntensity: number;
  crossGlow: boolean;
  crossX: number; // 0-100%
  crossY: number; // 0-100%
  crossIntensity: number;
  particles: boolean;
  particlesIntensity: number;
  flares: boolean;
  flaresIntensity: number;
  warmAura: boolean;
  warmAuraIntensity: number;
}

interface ImageFraming {
  scale: number; // 0.5 a 2.5
  offsetX: number; // -500 a 500
  offsetY: number; // -500 a 500
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  phase: number;
  twinkleSpeed: number;
  hue: number;
}

interface ExportTelemetry {
  percent: number;
  currentFrame: number;
  totalFrames: number;
  elapsedSec: number;
  engineLabel: string;
  finalDurationSec: number;
  fileSizeText: string;
  actualFormatLabel: string;
}

// ============================================================================
// CONSTANTES Y PRESETS CRISTIANOS
// ============================================================================

const BIBLICAL_PRESETS = [
  'JESUCRISTO TE AMA',
  'HOY ES EL DÍA DE TU SALVACIÓN',
  'VEN A CRISTO',
  'EN JESUCRISTO HAY DESCANSO PARA TU ALMA',
  'EL EVANGELIO DE JESUCRISTO PARA TODOS',
  'JAIRRESTAURA EVANGELISTA',
  'DIOS TIENE UN PROPÓSITO CONTIGO'
];

const INITIAL_TEXT_LAYERS: TextLayer[] = [
  {
    id: 'layer-1',
    text: '¡JESUCRISTO TE AMA!',
    x: 50,
    y: 12,
    fontSize: 48,
    color: 'gold',
    effect: 'gold-shine',
    visible: true
  },
  {
    id: 'layer-2',
    text: 'HOY ES EL DÍA DE TU SALVACIÓN',
    x: 50,
    y: 20,
    fontSize: 34,
    color: 'white',
    effect: 'fade-in',
    visible: true
  },
  {
    id: 'layer-3',
    text: 'JAIRRESTAURA EVANGELISTA',
    x: 50,
    y: 83,
    fontSize: 36,
    color: 'gold',
    effect: 'gold-shine',
    visible: true
  },
  {
    id: 'layer-4',
    text: '¡VEN A CRISTO!',
    x: 50,
    y: 91,
    fontSize: 52,
    color: 'warm',
    effect: 'glow-pulse',
    visible: true
  }
];

const RESOLUTIONS: Record<ResolutionKey, { width: number; height: number; aspect: AspectRatioKey; label: string }> = {
  '720x720': { width: 720, height: 720, aspect: '1:1', label: '720 × 720 (Cuadrado Rápido 1:1)' },
  '1080x1080': { width: 1080, height: 1080, aspect: '1:1', label: '1080 × 1080 (Cuadrado HD 1:1)' },
  '720x1280': { width: 720, height: 1280, aspect: '9:16', label: '720 × 1280 (Vertical HD 9:16)' },
  '1080x1920': { width: 1080, height: 1920, aspect: '9:16', label: '1080 × 1920 (Vertical Full HD 9:16)' },
  '1920x1080': { width: 1920, height: 1080, aspect: '16:9', label: '1920 × 1080 (Horizontal Full HD 16:9)' }
};

const EXPORT_MODALITIES: Record<
  ExportPresetMode,
  {
    title: string;
    badge: string;
    resolution: ResolutionKey;
    fps: 24 | 25 | 30;
    quality: ExportQuality;
    bitrate: number;
    desc: string;
  }
> = {
  fast: {
    title: 'RÁPIDA',
    badge: 'Ultrarrápida',
    resolution: '720x720',
    fps: 24,
    quality: 'standard',
    bitrate: 2_600_000,
    desc: '720 × 720 • 24 FPS • Prioridad máxima a la velocidad'
  },
  recommended: {
    title: 'RECOMENDADA',
    badge: 'Equilibrada',
    resolution: '1080x1080',
    fps: 30,
    quality: 'high',
    bitrate: 5_200_000,
    desc: '1080 × 1080 • 30 FPS • Alta calidad y rapidez'
  },
  professional: {
    title: 'PROFESIONAL',
    badge: 'Máxima Calidad',
    resolution: '1080x1080',
    fps: 30,
    quality: 'max',
    bitrate: 8_500_000,
    desc: '1080 × 1080 • 30 FPS • Mayor tasa de bits compatible'
  }
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function createDefaultPastorCanvas(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = 1080;
  c.height = 1920;
  const g = c.getContext('2d')!;

  const skyGrad = g.createLinearGradient(0, 0, 0, 1920);
  skyGrad.addColorStop(0, '#040814');
  skyGrad.addColorStop(0.35, '#112247');
  skyGrad.addColorStop(0.68, '#78350f');
  skyGrad.addColorStop(1, '#050811');
  g.fillStyle = skyGrad;
  g.fillRect(0, 0, 1080, 1920);

  // Gran Cruz Dorada Central
  const crossX = 540;
  const crossY = 580;
  g.save();
  g.shadowColor = '#fbbf24';
  g.shadowBlur = 70;
  const crossGrad = g.createLinearGradient(crossX - 140, crossY - 220, crossX + 140, crossY + 320);
  crossGrad.addColorStop(0, '#fef9c3');
  crossGrad.addColorStop(0.5, '#f59e0b');
  crossGrad.addColorStop(1, '#b45309');
  g.fillStyle = crossGrad;
  g.fillRect(crossX - 28, crossY - 230, 56, 540);
  g.fillRect(crossX - 185, crossY - 85, 370, 54);
  g.restore();

  // Silueta de Estadio / Multitud en Avivamiento
  g.fillStyle = 'rgba(10, 14, 28, 0.72)';
  g.beginPath();
  g.ellipse(540, 1420, 760, 340, 0, 0, Math.PI * 2);
  g.fill();

  // Siluetas de manos levantadas en adoración
  g.fillStyle = '#070b16';
  for (let i = 0; i < 34; i++) {
    const px = 30 + i * 31;
    const py = 1360 + Math.sin(i * 0.7) * 55;
    g.beginPath();
    g.arc(px, py, 22, 0, Math.PI * 2);
    g.fill();
    g.fillRect(px - 24, py + 18, 48, 220);
    if (i % 2 === 0) {
      g.fillRect(px + 14, py - 58, 9, 85);
    }
  }

  // Silueta elegante del Evangelista con Biblia
  g.save();
  g.fillStyle = '#1c120c';
  // Traje / Hombros
  g.beginPath();
  g.moveTo(350, 1650);
  g.quadraticCurveTo(365, 1130, 540, 1120);
  g.quadraticCurveTo(715, 1130, 730, 1650);
  g.closePath();
  g.fill();

  // Camisa blanca y corbata carmesí
  g.fillStyle = '#f8fafc';
  g.beginPath();
  g.moveTo(495, 1125);
  g.lineTo(585, 1125);
  g.lineTo(540, 1340);
  g.closePath();
  g.fill();

  g.fillStyle = '#b91c1c';
  g.beginPath();
  g.moveTo(532, 1135);
  g.lineTo(548, 1135);
  g.lineTo(554, 1310);
  g.lineTo(540, 1335);
  g.lineTo(526, 1310);
  g.closePath();
  g.fill();

  // Cabeza / Contorno iluminado por luz celestial
  g.shadowColor = 'rgba(251, 191, 36, 0.65)';
  g.shadowBlur = 24;
  g.fillStyle = '#261810';
  g.beginPath();
  g.ellipse(540, 1020, 68, 84, 0, 0, Math.PI * 2);
  g.fill();

  // Biblia abierta en mano
  g.fillStyle = '#0f172a';
  g.fillRect(615, 1250, 165, 110);
  g.fillStyle = '#fef3c7';
  g.fillRect(625, 1258, 70, 92);
  g.fillRect(700, 1258, 70, 92);
  g.restore();

  return c;
}

// ============================================================================
// CODIFICADOR GIF PURO EN JAVASCRIPT (SIN DEPENDENCIAS EXTERNAS FRÁGILES)
// ============================================================================

function encodeSimpleAnimatedGIF(
  framesImageData: ImageData[],
  width: number,
  height: number,
  delayCs: number
): Blob {
  // Cuantización rápida a paleta de 256 colores (3-3-2 RGB) para máxima velocidad y compatibilidad
  const bytes: number[] = [];
  const writeStr = (s: string) => {
    for (let i = 0; i < s.length; i++) bytes.push(s.charCodeAt(i));
  };
  const writeU16 = (v: number) => {
    bytes.push(v & 0xff, (v >> 8) & 0xff);
  };

  writeStr('GIF89a');
  writeU16(width);
  writeU16(height);
  bytes.push(0xf7, 0x00, 0x00); // Global Color Table 256 colores

  // Paleta 3-3-2 (256 entradas)
  for (let i = 0; i < 256; i++) {
    const r = Math.round(((i >> 5) & 0x07) * (255 / 7));
    const g = Math.round(((i >> 2) & 0x07) * (255 / 7));
    const b = Math.round((i & 0x03) * (255 / 3));
    bytes.push(r, g, b);
  }

  // Netscape 2.0 Loop infinito
  bytes.push(0x21, 0xff, 0x0b);
  writeStr('NETSCAPE2.0');
  bytes.push(0x03, 0x01, 0x00, 0x00, 0x00);

  for (const frame of framesImageData) {
    // Graphic Control Extension
    bytes.push(0x21, 0xf9, 0x04, 0x00);
    writeU16(delayCs);
    bytes.push(0x00, 0x00);

    // Image Descriptor
    bytes.push(0x2c);
    writeU16(0);
    writeU16(0);
    writeU16(width);
    writeU16(height);
    bytes.push(0x00);

    // LZW Minimum Code Size = 8
    const minCodeSize = 8;
    bytes.push(minCodeSize);

    const data = frame.data;
    const totalPixels = width * height;
    const indices = new Uint8Array(totalPixels);
    for (let p = 0; p < totalPixels; p++) {
      const idx = p * 4;
      const r = data[idx] >> 5;
      const g = data[idx + 1] >> 5;
      const b = data[idx + 2] >> 6;
      indices[p] = (r << 5) | (g << 2) | b;
    }

    // LZW sin compresión de diccionario compleja (códigos literales + clear codes periódicos)
    const clearCode = 256;
    const endCode = 257;
    const codeSize = 9;
    let bitBuffer = 0;
    let bitCount = 0;
    const lzwBytes: number[] = [];

    const pushCode = (code: number) => {
      bitBuffer |= code << bitCount;
      bitCount += codeSize;
      while (bitCount >= 8) {
        lzwBytes.push(bitBuffer & 0xff);
        bitBuffer >>= 8;
        bitCount -= 8;
      }
    };

    pushCode(clearCode);
    for (let i = 0; i < totalPixels; i++) {
      pushCode(indices[i]);
      if ((i + 1) % 250 === 0) {
        pushCode(clearCode);
      }
    }
    pushCode(endCode);
    if (bitCount > 0) {
      lzwBytes.push(bitBuffer & 0xff);
    }

    // Escribir sub-bloques de máximo 255 bytes
    let offset = 0;
    while (offset < lzwBytes.length) {
      const chunkLen = Math.min(255, lzwBytes.length - offset);
      bytes.push(chunkLen);
      for (let k = 0; k < chunkLen; k++) {
        bytes.push(lzwBytes[offset + k]);
      }
      offset += chunkLen;
    }
    bytes.push(0x00); // Fin de imagen
  }

  bytes.push(0x3b); // Trailer GIF
  return new Blob([new Uint8Array(bytes)], { type: 'image/gif' });
}

// ============================================================================
// SINTETIZADOR DE AMBIENTE CELESTIAL INSTRUMENTAL (WEB AUDIO API)
// ============================================================================

function renderCelestialAmbientBuffer(ctx: BaseAudioContext, durationSec: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.ceil(sampleRate * durationSec);
  const buffer = ctx.createBuffer(2, length, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  // Acordes épicos de adoración: Do mayor -> Sol mayor -> La menor -> Fa mayor (C - G - Am - F)
  const chords = [
    [130.81, 196.00, 261.63, 329.63, 392.00], // C
    [98.00, 196.00, 246.94, 293.66, 392.00],  // G
    [110.00, 164.81, 220.00, 261.63, 329.63], // Am
    [87.31, 174.61, 220.00, 261.63, 349.23]   // F
  ];

  const chordDuration = durationSec / 4;

  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    const chordIdx = Math.min(3, Math.floor(t / chordDuration));
    const chord = chords[chordIdx];

    // Envolvente suave de entrada y salida
    const fadeIn = Math.min(1, t / 1.5);
    const fadeOut = Math.min(1, (durationSec - t) / 1.8);
    const env = fadeIn * fadeOut * 0.22;

    let sampleL = 0;
    let sampleR = 0;

    for (let n = 0; n < chord.length; n++) {
      const freq = chord[n];
      const detune = (n % 2 === 0 ? 1.002 : 0.998);
      const pad1 = Math.sin(2 * Math.PI * freq * t);
      const pad2 = Math.sin(2 * Math.PI * freq * detune * t + 0.5) * 0.6;
      const harmonic = Math.sin(2 * Math.PI * freq * 2 * t) * 0.15;
      const val = (pad1 + pad2 + harmonic) / chord.length;

      sampleL += val * (n % 2 === 0 ? 0.85 : 0.45);
      sampleR += val * (n % 2 === 0 ? 0.45 : 0.85);
    }

    // Arpegio celestial sutil (campanas suaves)
    const arpStep = Math.floor(t * 2);
    const arpLocal = (t * 2) - arpStep;
    const arpFreq = chord[arpStep % chord.length] * 2;
    const bellEnv = Math.exp(-arpLocal * 4.5) * 0.08;
    const bell = Math.sin(2 * Math.PI * arpFreq * t) * bellEnv;

    left[i] = (sampleL + bell) * env;
    right[i] = (sampleR + bell * 0.8) * env;
  }

  return buffer;
}

// ============================================================================
// COMPONENTE PRINCIPAL DE LA APLICACIÓN
// ============================================================================

export default function App() {
  // Pestaña activa del panel de herramientas
  const [activeTab, setActiveTab] = useState<'image' | 'effects' | 'text' | 'audio' | 'export'>('export');

  // Estado de imagen original y encuadre no destructivo
  const [imageName, setImageName] = useState<string>('Ilustración Base Pastor Jair');
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const [framing, setFraming] = useState<ImageFraming>({ scale: 1, offsetX: 0, offsetY: 0 });
  const sourceImageRef = useRef<HTMLImageElement | HTMLCanvasElement | null>(null);

  // Estado de cámara y efectos celestiales
  const [cameraMode, setCameraMode] = useState<CameraMode>('cinematic-in');
  const [cameraIntensity, setCameraIntensity] = useState<number>(65);
  const [effects, setEffects] = useState<CelestialEffects>({
    rays: true,
    raysIntensity: 85,
    crossGlow: true,
    crossX: 50,
    crossY: 31,
    crossIntensity: 85,
    particles: true,
    particlesIntensity: 90,
    flares: true,
    flaresIntensity: 75,
    warmAura: true,
    warmAuraIntensity: 60
  });

  // Estado de capas de texto bíblico
  const [textLayers, setTextLayers] = useState<TextLayer[]>(INITIAL_TEXT_LAYERS);
  const [selectedLayerId, setSelectedLayerId] = useState<string>('layer-1');

  // Estado de Audio / Jingle (Web Audio API)
  const [audioSourceType, setAudioSourceType] = useState<'none' | 'file' | 'celestial-synth'>('celestial-synth');
  const [audioFileName, setAudioFileName] = useState<string>('');
  const [audioVolume, setAudioVolume] = useState<number>(100);
  const [audioStartOffset, setAudioStartOffset] = useState<number>(0);
  const [audioDurationSec, setAudioDurationSec] = useState<number>(0);
  const userAudioBufferRef = useRef<AudioBuffer | null>(null);
  const userAudioFileRef = useRef<File | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Estado de Reproducción y Línea de Tiempo
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [durationSec, setDurationSec] = useState<number>(10);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);

  // Estado de Exportación y Modalidades
  const [presetMode, setPresetMode] = useState<ExportPresetMode>('fast');
  const [resolutionKey, setResolutionKey] = useState<ResolutionKey>('720x720');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('mp4');
  const [fps, setFps] = useState<24 | 25 | 30>(24);
  const [quality, setQuality] = useState<ExportQuality>('standard');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportStatusText, setExportStatusText] = useState<string>('');
  const [telemetry, setTelemetry] = useState<ExportTelemetry>({
    percent: 0,
    currentFrame: 0,
    totalFrames: 240,
    elapsedSec: 0,
    engineLabel: 'WebCodecs Hardware',
    finalDurationSec: 10,
    fileSizeText: '',
    actualFormatLabel: 'MP4'
  });
  const [exportedBlob, setExportedBlob] = useState<Blob | null>(null);
  const [exportedFileName, setExportedFileName] = useState<string>('');
  const [exportedUrl, setExportedUrl] = useState<string>('');

  // Controladores de cancelación segura y bloqueo contra exportaciones simultáneas
  const cancelExportRef = useRef<boolean>(false);
  const exportLockRef = useRef<boolean>(false);
  const activeRecorderRef = useRef<MediaRecorder | null>(null);

  // Aplicar modalidad automática (RÁPIDA / RECOMENDADA / PROFESIONAL)
  const applyPresetMode = useCallback((mode: ExportPresetMode) => {
    const cfg = EXPORT_MODALITIES[mode];
    setPresetMode(mode);
    setResolutionKey(cfg.resolution);
    setFps(cfg.fps);
    setQuality(cfg.quality);
  }, []);

  // Notificaciones toast (sin alert/confirm)
  const [toast, setToast] = useState<{ text: string; type: 'info' | 'success' | 'error' } | null>(null);
  const showToast = useCallback((text: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToast({ text, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  // Referencias de Canvas y animación
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isDraggingCanvasRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; origX: number; origY: number }>({ x: 0, y: 0, origX: 0, origY: 0 });
  const timeRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  // Inicializar partículas e imagen base al montar
  useEffect(() => {
    const pts: Particle[] = [];
    for (let i = 0; i < 110; i++) {
      pts.push({
        x: Math.random(),
        y: Math.random(),
        size: 1.5 + Math.random() * 4.5,
        speedY: 0.04 + Math.random() * 0.11,
        speedX: (Math.random() - 0.5) * 0.03,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: 1.5 + Math.random() * 3,
        hue: 38 + Math.random() * 16
      });
    }
    particlesRef.current = pts;

    // Cargar ilustración base inmediatamente para experiencia instantánea
    sourceImageRef.current = createDefaultPastorCanvas();

    // Intentar cargar edited-image.jpg si existe en el entorno
    const probe = new Image();
    probe.crossOrigin = 'anonymous';
    probe.onload = () => {
      sourceImageRef.current = probe;
      setImageName('Pastor Jair - JairRestaura Evangelista');
    };
    probe.src = 'edited-image.jpg';
  }, []);

  // ============================================================================
  // CONTROL DE AUDIO EN VIVO (WEB AUDIO API)
  // ============================================================================

  const stopLiveAudio = useCallback(() => {
    if (activeAudioSourceRef.current) {
      try {
        activeAudioSourceRef.current.stop();
        activeAudioSourceRef.current.disconnect();
      } catch {
        // Ignorar si ya estaba detenido
      }
      activeAudioSourceRef.current = null;
    }
  }, []);

  const startLiveAudio = useCallback(
    async (offsetInTimeline = 0) => {
      stopLiveAudio();
      if (audioSourceType === 'none') return;

      try {
        if (!audioCtxRef.current) {
          const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        let bufferToPlay: AudioBuffer | null = null;
        let startAt = 0;

        if (audioSourceType === 'file' && userAudioBufferRef.current) {
          bufferToPlay = userAudioBufferRef.current;
          startAt = Math.min(Math.max(0, audioStartOffset + offsetInTimeline), Math.max(0, bufferToPlay.duration - 0.1));
        } else if (audioSourceType === 'celestial-synth') {
          bufferToPlay = renderCelestialAmbientBuffer(ctx, durationSec);
          startAt = Math.min(offsetInTimeline, Math.max(0, durationSec - 0.1));
        }

        if (!bufferToPlay) return;

        const source = ctx.createBufferSource();
        source.buffer = bufferToPlay;
        source.loop = true;

        const gainNode = ctx.createGain();
        gainNode.gain.value = audioVolume / 100;

        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        source.start(0, startAt);
        activeAudioSourceRef.current = source;
      } catch {
        // El navegador puede requerir interacción previa del usuario
      }
    },
    [audioSourceType, audioStartOffset, audioVolume, durationSec, stopLiveAudio]
  );

  // Sincronizar audio al reproducir/pausar
  useEffect(() => {
    if (isPlaying && !isExporting) {
      startLiveAudio(timeRef.current % durationSec);
    } else {
      stopLiveAudio();
    }
    return () => stopLiveAudio();
  }, [isPlaying, isExporting, audioSourceType, audioStartOffset, audioVolume, durationSec, startLiveAudio, stopLiveAudio]);

  // ============================================================================
  // MANEJO DE CARGA DE IMÁGENES Y AUDIO
  // ============================================================================

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Por favor selecciona una imagen válida (JPG, JPEG, PNG o WEBP).', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        sourceImageRef.current = img;
        setImageName(file.name);
        setFraming({ scale: 1, offsetX: 0, offsetY: 0 });
        showToast(`Imagen "${file.name}" cargada correctamente.`, 'success');
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAudioFile = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      const decoded = await ctx.decodeAudioData(arrayBuffer);
      userAudioBufferRef.current = decoded;
      userAudioFileRef.current = file;
      setAudioFileName(file.name);
      setAudioDurationSec(decoded.duration);
      setAudioStartOffset(0);
      setAudioSourceType('file');
      showToast(`Audio "${file.name}" cargado y sincronizado.`, 'success');
    } catch {
      showToast('No se pudo decodificar el archivo de audio. Prueba con MP3 o WAV.', 'error');
    }
  };

  // Caché de viñeta pre-renderizada para evitar recrear gradientes en cada fotograma
  const vignetteCacheRef = useRef<{ width: number; height: number; canvas: HTMLCanvasElement } | null>(null);

  const getCachedVignette = useCallback((width: number, height: number): HTMLCanvasElement => {
    const existing = vignetteCacheRef.current;
    if (existing && existing.width === width && existing.height === height) {
      return existing.canvas;
    }
    const vCanvas = document.createElement('canvas');
    vCanvas.width = width;
    vCanvas.height = height;
    const vCtx = vCanvas.getContext('2d')!;
    const vig = vCtx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.35,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.75
    );
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(3, 5, 12, 0.46)');
    vCtx.fillStyle = vig;
    vCtx.fillRect(0, 0, width, height);
    vignetteCacheRef.current = { width, height, canvas: vCanvas };
    return vCanvas;
  }, []);

  // ============================================================================
  // MOTOR DE RENDERIZADO CINEMATOGRÁFICO EN CANVAS 2D (OPTIMIZADO Y DETERMINISTA)
  // ============================================================================

  const renderSceneAtTime = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, t: number, totalDur: number) => {
      // Fondo negro profundo base (sobrescribe todo sin necesitar clearRect previo)
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, width, height);

      const progress = totalDur > 0 ? Math.min(1, t / totalDur) : 0;
      const camFactor = cameraIntensity / 100;

      // 1. CÁLCULO DE MOVIMIENTO DE CÁMARA
      let camScale = 1;
      let camPanX = 0;
      let camPanY = 0;
      let camRotate = 0;

      switch (cameraMode) {
        case 'cinematic-in':
          camScale = 1 + progress * 0.14 * camFactor;
          camPanY = -progress * height * 0.025 * camFactor;
          break;
        case 'progressive-zoom':
          camScale = 1 + (Math.sin(t * 0.7) * 0.5 + 0.5) * 0.09 * camFactor;
          break;
        case 'smooth-out':
          camScale = 1 + (1 - progress) * 0.14 * camFactor;
          break;
        case 'pan-sweep':
          camScale = 1 + 0.08 * camFactor;
          camPanX = Math.sin(progress * Math.PI * 2) * width * 0.035 * camFactor;
          break;
        case 'depth-3d':
          camScale = 1 + 0.06 * camFactor + Math.sin(t * 0.9) * 0.025 * camFactor;
          camPanX = Math.cos(t * 0.6) * width * 0.018 * camFactor;
          camPanY = Math.sin(t * 0.75) * height * 0.015 * camFactor;
          camRotate = Math.sin(t * 0.5) * 0.012 * camFactor;
          break;
        case 'static':
        default:
          camScale = 1;
          break;
      }

      // 2. DIBUJAR IMAGEN PRINCIPAL CON ENCUADRE NO DESTRUCTIVO
      const src = sourceImageRef.current;
      ctx.save();
      ctx.translate(width / 2 + camPanX, height / 2 + camPanY);
      ctx.rotate(camRotate);
      ctx.scale(camScale, camScale);
      ctx.translate(-width / 2, -height / 2);

      if (src) {
        const srcW = src.width || 1080;
        const srcH = src.height || 1920;
        const srcRatio = srcW / srcH;
        const dstRatio = width / height;

        let baseDrawW = width;
        let baseDrawH = height;
        if (srcRatio > dstRatio) {
          baseDrawW = height * srcRatio;
        } else {
          baseDrawH = width / srcRatio;
        }

        const finalW = baseDrawW * framing.scale;
        const finalH = baseDrawH * framing.scale;
        const normOffsetX = (framing.offsetX / 720) * width;
        const normOffsetY = (framing.offsetY / 1280) * height;

        const drawX = (width - finalW) / 2 + normOffsetX;
        const drawY = (height - finalH) / 2 + normOffsetY;

        ctx.drawImage(src, drawX, drawY, finalW, finalH);
      }
      ctx.restore();

      // 3. RESPLANDOR AMBIENTAL CÁLIDO
      if (effects.warmAura && effects.warmAuraIntensity > 0) {
        const alpha = (effects.warmAuraIntensity / 100) * 0.35;
        const aura = ctx.createRadialGradient(
          width * 0.5,
          height * 0.38,
          width * 0.05,
          width * 0.5,
          height * 0.45,
          Math.max(width, height) * 0.75
        );
        aura.addColorStop(0, `rgba(254, 240, 138, ${alpha})`);
        aura.addColorStop(0.5, `rgba(217, 119, 6, ${alpha * 0.55})`);
        aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = aura;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // Punto de origen de luz (Cruz)
      const lightX = (effects.crossX / 100) * width + camPanX * 0.5;
      const lightY = (effects.crossY / 100) * height + camPanY * 0.5;

      // 4. ILUMINACIÓN DE LA CRUZ (HALO PULSANTE)
      if (effects.crossGlow && effects.crossIntensity > 0) {
        const intens = effects.crossIntensity / 100;
        const pulse = 0.88 + Math.sin(t * 2.4) * 0.12;
        const maxR = Math.min(width, height) * 0.55 * pulse;

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const halo = ctx.createRadialGradient(lightX, lightY, 4, lightX, lightY, maxR);
        halo.addColorStop(0, `rgba(255, 253, 224, ${0.85 * intens})`);
        halo.addColorStop(0.28, `rgba(251, 191, 36, ${0.48 * intens})`);
        halo.addColorStop(0.65, `rgba(217, 119, 6, ${0.16 * intens})`);
        halo.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = halo;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // 5. RAYOS CELESTIALES GIRATORIOS
      if (effects.rays && effects.raysIntensity > 0) {
        const intens = effects.raysIntensity / 100;
        const numRays = 18;
        const rayMaxLen = Math.max(width, height) * 0.85;

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.translate(lightX, lightY);

        for (let i = 0; i < numRays; i++) {
          const angle = (i / numRays) * Math.PI * 2 + t * 0.14;
          const spread = 0.032 + (i % 3) * 0.016;
          const len = rayMaxLen * (0.85 + Math.sin(t * 1.8 + i) * 0.15);

          ctx.save();
          ctx.rotate(angle);
          const rg = ctx.createLinearGradient(0, 0, len, 0);
          rg.addColorStop(0, `rgba(254, 249, 195, ${0.38 * intens})`);
          rg.addColorStop(0.55, `rgba(245, 158, 11, ${0.14 * intens})`);
          rg.addColorStop(1, 'rgba(245, 158, 11, 0)');

          ctx.fillStyle = rg;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(len, -Math.tan(spread) * len);
          ctx.lineTo(len, Math.tan(spread) * len);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();
      }

      // 6. PARTÍCULAS DORADAS ASCENDENTES Y POLVO LUMINOSO
      if (effects.particles && effects.particlesIntensity > 0) {
        const intens = effects.particlesIntensity / 100;
        const pts = particlesRef.current;
        const count = Math.floor(pts.length * intens);
        const scaleFactor = width / 720;

        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        for (let i = 0; i < count; i++) {
          const p = pts[i];
          // Posición determinista basada en `t` para que la exportación cuadro a cuadro sea perfecta
          const rawY = (p.y - t * p.speedY) % 1;
          const py = (rawY < 0 ? rawY + 1 : rawY) * height;
          const px = ((p.x + Math.sin(t * 1.3 + p.phase) * 0.03 + t * p.speedX) % 1 + 1) % 1 * width;

          const twinkle = 0.35 + Math.sin(t * p.twinkleSpeed + p.phase) * 0.55;
          const alpha = Math.max(0, twinkle * intens);
          if (alpha < 0.03) continue;

          const radius = p.size * 2.6 * scaleFactor;
          const pg = ctx.createRadialGradient(px, py, 0, px, py, radius);
          pg.addColorStop(0, `hsla(${p.hue}, 100%, 90%, ${alpha})`);
          pg.addColorStop(0.45, `hsla(${p.hue}, 100%, 60%, ${alpha * 0.6})`);
          pg.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`);

          ctx.fillStyle = pg;
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 7. DESTELLOS DORADOS (SPARKLES / LENS FLARES)
      if (effects.flares && effects.flaresIntensity > 0) {
        const intens = effects.flaresIntensity / 100;
        const scaleFactor = width / 720;
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        for (let i = 0; i < 14; i++) {
          const fx = width * (0.12 + ((i * 0.618) % 0.76));
          const fy = height * (0.14 + ((i * 0.382) % 0.72));
          const wave = Math.max(0, Math.sin(t * (1.8 + (i % 4) * 0.5) + i * 1.7));
          if (wave < 0.15) continue;

          const arm = (10 + (i % 3) * 8) * wave * intens * scaleFactor;
          ctx.strokeStyle = `rgba(255, 250, 215, ${wave * 0.85 * intens})`;
          ctx.lineWidth = 1.8 * scaleFactor;

          ctx.beginPath();
          ctx.moveTo(fx - arm, fy);
          ctx.lineTo(fx + arm, fy);
          ctx.moveTo(fx, fy - arm);
          ctx.lineTo(fx, fy + arm);
          ctx.stroke();

          ctx.fillStyle = `rgba(254, 240, 138, ${wave * 0.6 * intens})`;
          ctx.beginPath();
          ctx.arc(fx, fy, arm * 0.22, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Viñeta cinematográfica sutil para resaltar textos
      const vig = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.35,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.75
      );
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(3, 5, 12, 0.48)');
      // Viñeta cinematográfica pre-renderizada en caché (cero sobrecarga por fotograma)
      ctx.drawImage(getCachedVignette(width, height), 0, 0);

      // 8. CAPAS DE TEXTO BÍBLICO Y EVANGELÍSTICO ANIMADO
      const scaleFactor = width / 720;
      for (const layer of textLayers) {
        if (!layer.visible || !layer.text.trim()) continue;

        let alpha = 1;
        let yShift = 0;
        let glowBlur = 16 * scaleFactor;

        if (layer.effect === 'fade-in') {
          alpha = Math.min(1, t / 1.4);
          yShift = (1 - alpha) * 18 * scaleFactor;
        } else if (layer.effect === 'glow-pulse') {
          glowBlur = (14 + Math.sin(t * 3.5) * 10) * scaleFactor;
        } else if (layer.effect === 'fade-out-end') {
          const remaining = totalDur - (t % totalDur);
          alpha = remaining < 1.5 ? Math.max(0, remaining / 1.5) : 1;
        }

        const tx = (layer.x / 100) * width;
        const ty = (layer.y / 100) * height + yShift;
        const fontPx = Math.round(layer.fontSize * scaleFactor);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `900 ${fontPx}px "Cinzel", Georgia, serif`;

        // Sombra profunda para máxima legibilidad sobre cualquier fondo
        ctx.shadowColor = 'rgba(0, 0, 0, 0.92)';
        ctx.shadowBlur = 14 * scaleFactor;
        ctx.shadowOffsetY = 3 * scaleFactor;

        // Ajuste automático de ancho máximo (wrap simple si es muy largo)
        const maxTextW = width * 0.9;
        const words = layer.text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        for (const w of words) {
          const testLine = currentLine ? `${currentLine} ${w}` : w;
          if (ctx.measureText(testLine).width > maxTextW && currentLine) {
            lines.push(currentLine);
            currentLine = w;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);

        const lineHeight = fontPx * 1.18;
        const startY = ty - ((lines.length - 1) * lineHeight) / 2;

        lines.forEach((line, idx) => {
          const ly = startY + idx * lineHeight;

          // Contorno oscuro sutil
          ctx.strokeStyle = 'rgba(10, 8, 4, 0.85)';
          ctx.lineWidth = Math.max(2, fontPx * 0.08);
          ctx.strokeText(line, tx, ly);

          // Relleno según color seleccionado
          if (layer.color === 'gold') {
            const textGrad = ctx.createLinearGradient(tx - width * 0.35, ly - fontPx / 2, tx + width * 0.35, ly + fontPx / 2);
            textGrad.addColorStop(0, '#b45309');
            textGrad.addColorStop(0.28, '#fde047');
            textGrad.addColorStop(0.5, '#fef9c3');
            textGrad.addColorStop(0.72, '#f59e0b');
            textGrad.addColorStop(1, '#92400e');

            // Destello metálico animado recorriendo las letras doradas
            if (layer.effect === 'gold-shine') {
              const shinePos = ((t * 0.42) % 1.4) - 0.2;
              const s0 = Math.max(0, Math.min(1, shinePos - 0.12));
              const s1 = Math.max(0, Math.min(1, shinePos));
              const s2 = Math.max(0, Math.min(1, shinePos + 0.12));
              textGrad.addColorStop(s0, '#f59e0b');
              textGrad.addColorStop(s1, '#ffffff');
              textGrad.addColorStop(s2, '#f59e0b');
            }
            ctx.fillStyle = textGrad;
          } else if (layer.color === 'warm') {
            ctx.fillStyle = '#fef08a';
          } else {
            ctx.fillStyle = '#ffffff';
          }

          if (layer.effect === 'glow-pulse') {
            ctx.shadowColor = 'rgba(251, 191, 36, 0.85)';
            ctx.shadowBlur = glowBlur;
          }

          ctx.fillText(line, tx, ly);
        });

        ctx.restore();
      }
    },
    [cameraMode, cameraIntensity, framing, effects, textLayers, getCachedVignette]
  );

  // ============================================================================
  // BUCLE DE ANIMACIÓN EN TIEMPO REAL (SE PAUSA AUTOMÁTICAMENTE AL EXPORTAR)
  // ============================================================================

  useEffect(() => {
    // Pausar el bucle de vista previa durante la exportación para dedicar 100% de CPU/GPU al render
    if (isExporting) return;

    let rafId: number;
    const res = RESOLUTIONS[resolutionKey];
    lastFrameTimeRef.current = 0;

    const loop = (now: number) => {
      if (!lastFrameTimeRef.current) lastFrameTimeRef.current = now;
      const dt = (now - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = now;

      if (isPlaying) {
        timeRef.current = (timeRef.current + dt) % durationSec;
        setCurrentTimeSec(timeRef.current);
      }

      const canvas = previewCanvasRef.current;
      if (canvas) {
        if (canvas.width !== res.width || canvas.height !== res.height) {
          canvas.width = res.width;
          canvas.height = res.height;
        }
        const ctx = canvas.getContext('2d', { alpha: false });
        if (ctx) {
          renderSceneAtTime(ctx, res.width, res.height, timeRef.current, durationSec);
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, isExporting, durationSec, resolutionKey, renderSceneAtTime]);

  // ============================================================================
  // ARRASTRE DIRECTO SOBRE EL LIENZO PARA REENCUADRAR IMAGEN
  // ============================================================================

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingCanvasRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      origX: framing.offsetX,
      origY: framing.offsetY
    };
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingCanvasRef.current) return;
    const dx = (e.clientX - dragStartRef.current.x) * 1.8;
    const dy = (e.clientY - dragStartRef.current.y) * 1.8;
    setFraming((prev) => ({
      ...prev,
      offsetX: Math.max(-500, Math.min(500, Math.round(dragStartRef.current.origX + dx))),
      offsetY: Math.max(-500, Math.min(500, Math.round(dragStartRef.current.origY + dy)))
    }));
  };

  const handleCanvasPointerUp = () => {
    isDraggingCanvasRef.current = false;
  };

  // ============================================================================
  // MEZCLA OFFLINE DE AUDIO PARA EXPORTACIÓN SINCRONIZADA
  // ============================================================================

  const buildMixedAudioBuffer = async (targetDurationSec: number, sampleRate = 48000): Promise<AudioBuffer | null> => {
    if (audioSourceType === 'none') return null;

    const totalSamples = Math.ceil(targetDurationSec * sampleRate);
    const offlineCtx = new OfflineAudioContext(2, totalSamples, sampleRate);

    let sourceBuf: AudioBuffer | null = null;
    let startOffset = 0;

    if (audioSourceType === 'file' && userAudioBufferRef.current) {
      sourceBuf = userAudioBufferRef.current;
      startOffset = Math.min(audioStartOffset, Math.max(0, sourceBuf.duration - 0.1));
    } else if (audioSourceType === 'celestial-synth') {
      sourceBuf = renderCelestialAmbientBuffer(offlineCtx, targetDurationSec);
      startOffset = 0;
    }

    if (!sourceBuf) return null;

    const srcNode = offlineCtx.createBufferSource();
    srcNode.buffer = sourceBuf;
    srcNode.loop = true;

    const gainNode = offlineCtx.createGain();
    gainNode.gain.value = audioVolume / 100;

    srcNode.connect(gainNode);
    gainNode.connect(offlineCtx.destination);
    srcNode.start(0, startOffset);

    return await offlineCtx.startRendering();
  };

  // Cancelación segura en cualquier momento del renderizado
  const handleCancelExport = useCallback(() => {
    if (!exportLockRef.current) return;
    cancelExportRef.current = true;
    setExportStatusText('Cancelando exportación y liberando memoria...');
    if (activeRecorderRef.current && activeRecorderRef.current.state !== 'inactive') {
      try {
        activeRecorderRef.current.stop();
      } catch {
        // Ignorar si ya estaba detenido
      }
    }
  }, []);

  // ============================================================================
  // EXPORTACIÓN ULTRARRÁPIDA: WEBCODECS HARDWARE -> MEDIARECORDER -> GIF / PNG
  // ============================================================================

  const handleExport = async (overrideOptions?: {
    mode?: ExportPresetMode;
    format?: ExportFormat;
    autoDownload?: boolean;
  }) => {
    // Evitar exportaciones simultáneas
    if (exportLockRef.current || isExporting) {
      showToast('Ya hay una exportación en curso. Espera o cancélala primero.', 'info');
      return;
    }

    const effectiveMode = overrideOptions?.mode ?? presetMode;
    const modeCfg = EXPORT_MODALITIES[effectiveMode];
    const effectiveResKey = overrideOptions?.mode ? modeCfg.resolution : resolutionKey;
    const effectiveFps = overrideOptions?.mode ? modeCfg.fps : fps;
    const effectiveQuality = overrideOptions?.mode ? modeCfg.quality : quality;
    const effectiveFormat = overrideOptions?.format ?? exportFormat;
    const autoDownload = overrideOptions?.autoDownload ?? false;

    if (overrideOptions?.mode) {
      applyPresetMode(overrideOptions.mode);
    }
    if (overrideOptions?.format) {
      setExportFormat(overrideOptions.format);
    }

    const res = RESOLUTIONS[effectiveResKey];

    // 1. EXPORTAR IMAGEN PNG INSTANTÁNEA
    if (effectiveFormat === 'png') {
      const offCanvas = document.createElement('canvas');
      offCanvas.width = res.width;
      offCanvas.height = res.height;
      const offCtx = offCanvas.getContext('2d', { alpha: false })!;
      renderSceneAtTime(offCtx, res.width, res.height, timeRef.current, durationSec);

      offCanvas.toBlob((blob) => {
        if (!blob) return;
        if (exportedUrl) URL.revokeObjectURL(exportedUrl);
        const url = URL.createObjectURL(blob);
        const fname = `JairRestaura_Evangelista_${res.width}x${res.height}.png`;
        setExportedBlob(blob);
        setExportedFileName(fname);
        setExportedUrl(url);
        setTelemetry({
          percent: 100,
          currentFrame: 1,
          totalFrames: 1,
          elapsedSec: 0.1,
          engineLabel: 'Canvas HD Snapshot',
          finalDurationSec: 0,
          fileSizeText: formatFileSize(blob.size),
          actualFormatLabel: 'PNG'
        });
        const a = document.createElement('a');
        a.href = url;
        a.download = fname;
        a.click();
        showToast('Imagen PNG en alta resolución descargada.', 'success');
      }, 'image/png');
      return;
    }

    // Bloquear exportaciones concurrentes y liberar URL anterior
    exportLockRef.current = true;
    cancelExportRef.current = false;
    setIsExporting(true);
    setExportProgress(0);
    if (exportedUrl) {
      URL.revokeObjectURL(exportedUrl);
      setExportedUrl('');
    }
    setExportedBlob(null);
    stopLiveAudio();

    const exportStartPerf = performance.now();
    // CÁLCULO EXACTO DE FOTOGRAMAS: 10s a 30fps = 300 frames; 10s a 24fps = 240 frames
    const exactTotalFrames = Math.round(durationSec * effectiveFps);

    setTelemetry({
      percent: 0,
      currentFrame: 0,
      totalFrames: exactTotalFrames,
      elapsedSec: 0,
      engineLabel: 'Iniciando...',
      finalDurationSec: durationSec,
      fileSizeText: '',
      actualFormatLabel: effectiveFormat.toUpperCase()
    });

    const finalizeAndRelease = () => {
      exportLockRef.current = false;
      cancelExportRef.current = false;
      activeRecorderRef.current = null;
      setIsExporting(false);
    };

    const triggerDownload = (url: string, filename: string) => {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    try {
      // 2. EXPORTAR GIF ANIMADO REAL EN NAVEGADOR
      if (effectiveFormat === 'gif') {
        const gifW = Math.round(res.width * 0.45);
        const gifH = Math.round(res.height * 0.45);
        const gifFps = 12;
        const gifTotalFrames = Math.round(durationSec * gifFps);

        setExportStatusText(`Generando ${gifTotalFrames} fotogramas GIF...`);
        const offCanvas = document.createElement('canvas');
        offCanvas.width = gifW;
        offCanvas.height = gifH;
        const offCtx = offCanvas.getContext('2d', { willReadFrequently: true, alpha: false })!;

        const frames: ImageData[] = [];
        for (let f = 0; f < gifTotalFrames; f++) {
          if (cancelExportRef.current) {
            frames.length = 0;
            showToast('Exportación GIF cancelada.', 'info');
            finalizeAndRelease();
            return;
          }
          const t = f / gifFps;
          renderSceneAtTime(offCtx, gifW, gifH, t, durationSec);
          frames.push(offCtx.getImageData(0, 0, gifW, gifH));

          const pct = Math.round(((f + 1) / gifTotalFrames) * 85);
          const elapsed = (performance.now() - exportStartPerf) / 1000;
          setExportProgress(pct);
          setTelemetry({
            percent: pct,
            currentFrame: f + 1,
            totalFrames: gifTotalFrames,
            elapsedSec: Number(elapsed.toFixed(1)),
            engineLabel: 'Codificador GIF Local',
            finalDurationSec: durationSec,
            fileSizeText: '',
            actualFormatLabel: 'GIF'
          });

          if (f % 4 === 0) await new Promise((r) => setTimeout(r, 0));
        }

        setExportStatusText('Empaquetando archivo GIF...');
        const gifBlob = encodeSimpleAnimatedGIF(frames, gifW, gifH, Math.round(100 / gifFps));
        frames.length = 0; // Liberar RAM inmediatamente

        const elapsedFinal = Number(((performance.now() - exportStartPerf) / 1000).toFixed(1));
        const url = URL.createObjectURL(gifBlob);
        const fname = `JairRestaura_Animado_${gifW}x${gifH}_${durationSec}s.gif`;

        setExportedBlob(gifBlob);
        setExportedFileName(fname);
        setExportedUrl(url);
        setExportProgress(100);
        setExportStatusText(`¡GIF listo en ${elapsedFinal}s!`);
        setTelemetry({
          percent: 100,
          currentFrame: gifTotalFrames,
          totalFrames: gifTotalFrames,
          elapsedSec: elapsedFinal,
          engineLabel: 'Codificador GIF Local',
          finalDurationSec: durationSec,
          fileSizeText: formatFileSize(gifBlob.size),
          actualFormatLabel: 'GIF'
        });

        if (autoDownload) triggerDownload(url, fname);
        showToast(`¡GIF animado exportado en ${elapsedFinal}s!`, 'success');
        finalizeAndRelease();
        return;
      }

      // 3. PRIMERA OPCIÓN: WEBCODECS API CON ACELERACIÓN POR HARDWARE (MP4 H.264 + AAC)
      if (effectiveFormat === 'mp4' && typeof VideoEncoder !== 'undefined') {
        let videoEncoder: VideoEncoder | null = null;
        let audioEncoder: AudioEncoder | null = null;

        try {
          setExportStatusText('Activando aceleración por hardware WebCodecs...');
          const { Muxer, ArrayBufferTarget } = await import(
            /* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/mp4-muxer@5.1.3/+esm'
          );

          const hasAudio = audioSourceType !== 'none' && typeof AudioEncoder !== 'undefined';
          const sampleRate = 48000;

          const target = new ArrayBufferTarget();
          const muxer = new Muxer({
            target,
            video: {
              codec: 'avc',
              width: res.width,
              height: res.height
            },
            audio: hasAudio
              ? {
                  codec: 'aac',
                  numberOfChannels: 2,
                  sampleRate
                }
              : undefined,
            fastStart: 'in-memory'
          });

          const bitrateMap: Record<ExportQuality, number> = {
            standard: 2_600_000,
            high: 5_200_000,
            max: 8_500_000
          };
          const targetBitrate = effectiveMode === 'fast' ? 2_600_000 : bitrateMap[effectiveQuality];

          let encoderError: Error | null = null;

          videoEncoder = new VideoEncoder({
            output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
            error: (e) => {
              encoderError = e;
            }
          });

          // Priorizar perfil Baseline/Main con aceleración por hardware para máxima velocidad
          const avcConfigs = [
            { codec: 'avc1.42001f', hw: 'prefer-hardware' as HardwareAcceleration },
            { codec: 'avc1.420028', hw: 'prefer-hardware' as HardwareAcceleration },
            { codec: 'avc1.4d002a', hw: 'prefer-hardware' as HardwareAcceleration },
            { codec: 'avc1.42001f', hw: 'no-preference' as HardwareAcceleration }
          ];

          let chosenConfig: VideoEncoderConfig | null = null;
          for (const candidate of avcConfigs) {
            const cfg: VideoEncoderConfig = {
              codec: candidate.codec,
              width: res.width,
              height: res.height,
              bitrate: targetBitrate,
              framerate: effectiveFps,
              hardwareAcceleration: candidate.hw,
              latencyMode: 'realtime'
            };
            const support = await VideoEncoder.isConfigSupported(cfg);
            if (support.supported) {
              chosenConfig = cfg;
              break;
            }
          }

          if (!chosenConfig) {
            throw new Error('H.264 WebCodecs no disponible en este navegador');
          }

          videoEncoder.configure(chosenConfig);

          // Codificar audio una sola vez en bloques AAC de 1024 muestras
          if (hasAudio) {
            setExportStatusText('Sincronizando pista de audio AAC...');
            const mixedAudio = await buildMixedAudioBuffer(durationSec, sampleRate);
            if (mixedAudio && !cancelExportRef.current) {
              audioEncoder = new AudioEncoder({
                output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
                error: (e) => {
                  encoderError = e;
                }
              });

              audioEncoder.configure({
                codec: 'mp4a.40.2',
                numberOfChannels: 2,
                sampleRate,
                bitrate: 160_000
              });

              const chunkFrames = 1024;
              const totalAudioFrames = mixedAudio.length;
              const ch0 = mixedAudio.getChannelData(0);
              const ch1 = mixedAudio.getChannelData(1);

              for (let offset = 0; offset < totalAudioFrames; offset += chunkFrames) {
                const len = Math.min(chunkFrames, totalAudioFrames - offset);
                const planar = new Float32Array(len * 2);
                planar.set(ch0.subarray(offset, offset + len), 0);
                planar.set(ch1.subarray(offset, offset + len), len);

                const audioData = new AudioData({
                  format: 'f32-planar',
                  sampleRate,
                  numberOfFrames: len,
                  numberOfChannels: 2,
                  timestamp: Math.round((offset / sampleRate) * 1_000_000),
                  data: planar
                });
                audioEncoder.encode(audioData);
                audioData.close();
              }

              await audioEncoder.flush();
              audioEncoder.close();
              audioEncoder = null;
            }
          }

          // Lienzo dedicado fuera de pantalla
          const offCanvas = document.createElement('canvas');
          offCanvas.width = res.width;
          offCanvas.height = res.height;
          const offCtx = offCanvas.getContext('2d', { alpha: false, desynchronized: true })!;

          const frameDurationUs = Math.round(1_000_000 / effectiveFps);
          const keyFrameInterval = effectiveFps * 2;

          for (let frameIdx = 0; frameIdx < exactTotalFrames; frameIdx++) {
            if (cancelExportRef.current) {
              if (videoEncoder.state !== 'closed') videoEncoder.close();
              showToast('Exportación cancelada. Memoria liberada.', 'info');
              finalizeAndRelease();
              return;
            }
            if (encoderError) throw encoderError;

            const t = frameIdx / effectiveFps;
            renderSceneAtTime(offCtx, res.width, res.height, t, durationSec);

            const videoFrame = new VideoFrame(offCanvas, {
              timestamp: frameIdx * frameDurationUs,
              duration: frameDurationUs
            });

            videoEncoder.encode(videoFrame, { keyFrame: frameIdx % keyFrameInterval === 0 });
            videoFrame.close(); // Liberar memoria de textura inmediatamente

            // Control de contrapresión: evitar que la cola supere 4 fotogramas
            if (videoEncoder.encodeQueueSize > 4) {
              await videoEncoder.flush();
            }

            // Actualizar telemetría y ceder hilo principal cada 3 fotogramas
            if (frameIdx % 3 === 0 || frameIdx === exactTotalFrames - 1) {
              const pct = Math.min(98, Math.round(((frameIdx + 1) / exactTotalFrames) * 98));
              const elapsed = Number(((performance.now() - exportStartPerf) / 1000).toFixed(1));
              setExportProgress(pct);
              setExportStatusText(`Codificando MP4 (${frameIdx + 1}/${exactTotalFrames} fotogramas)...`);
              setTelemetry({
                percent: pct,
                currentFrame: frameIdx + 1,
                totalFrames: exactTotalFrames,
                elapsedSec: elapsed,
                engineLabel: 'WebCodecs Hardware H.264',
                finalDurationSec: durationSec,
                fileSizeText: '',
                actualFormatLabel: 'MP4 (H.264 + AAC)'
              });
              await new Promise((r) => setTimeout(r, 0));
            }
          }

          await videoEncoder.flush();
          videoEncoder.close();
          videoEncoder = null;

          muxer.finalize();

          const mp4Blob = new Blob([target.buffer], { type: 'video/mp4' });
          const elapsedFinal = Number(((performance.now() - exportStartPerf) / 1000).toFixed(1));
          const url = URL.createObjectURL(mp4Blob);
          const fname = `JairRestaura_Evangelista_${res.width}x${res.height}_${durationSec}s.mp4`;

          setExportedBlob(mp4Blob);
          setExportedFileName(fname);
          setExportedUrl(url);
          setExportProgress(100);
          setExportStatusText(`¡Video MP4 listo en ${elapsedFinal}s!`);
          setTelemetry({
            percent: 100,
            currentFrame: exactTotalFrames,
            totalFrames: exactTotalFrames,
            elapsedSec: elapsedFinal,
            engineLabel: 'WebCodecs Hardware H.264',
            finalDurationSec: durationSec,
            fileSizeText: formatFileSize(mp4Blob.size),
            actualFormatLabel: 'MP4 (H.264 + AAC)'
          });

          if (autoDownload) triggerDownload(url, fname);
          showToast(`¡Video MP4 de ${durationSec}s listo en ${elapsedFinal}s!`, 'success');
          finalizeAndRelease();
          return;
        } catch (wcErr) {
          if (videoEncoder && videoEncoder.state !== 'closed') {
            try {
              videoEncoder.close();
            } catch {}
          }
          if (audioEncoder && audioEncoder.state !== 'closed') {
            try {
              audioEncoder.close();
            } catch {}
          }
          if (cancelExportRef.current) {
            finalizeAndRelease();
            return;
          }
          console.warn('Cambiando a segunda opción MediaRecorder:', wcErr);
        }
      }

      // 4. SEGUNDA OPCIÓN: MEDIARECORDER ACELERADO CON EXTENSIÓN REAL VERIFICADA
      setExportStatusText('Grabando con motor compatible MediaRecorder...');
      const offCanvas = document.createElement('canvas');
      offCanvas.width = res.width;
      offCanvas.height = res.height;
      const offCtx = offCanvas.getContext('2d', { alpha: false })!;

      const canvasStream = offCanvas.captureStream(effectiveFps);
      const tracks: MediaStreamTrack[] = [...canvasStream.getVideoTracks()];

      let recAudioCtx: AudioContext | null = null;
      let recAudioSrc: AudioBufferSourceNode | null = null;

      if (audioSourceType !== 'none') {
        const AudioCtx =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        recAudioCtx = new AudioCtx();
        const dest = recAudioCtx.createMediaStreamDestination();

        let buf: AudioBuffer | null = null;
        let offset = 0;
        if (audioSourceType === 'file' && userAudioBufferRef.current) {
          buf = userAudioBufferRef.current;
          offset = Math.min(audioStartOffset, Math.max(0, buf.duration - 0.1));
        } else {
          buf = renderCelestialAmbientBuffer(recAudioCtx, durationSec);
        }

        if (buf) {
          recAudioSrc = recAudioCtx.createBufferSource();
          recAudioSrc.buffer = buf;
          recAudioSrc.loop = true;
          const gain = recAudioCtx.createGain();
          gain.gain.value = audioVolume / 100;
          recAudioSrc.connect(gain);
          gain.connect(dest);
          recAudioSrc.start(0, offset);
          tracks.push(...dest.stream.getAudioTracks());
        }
      }

      const combinedStream = new MediaStream(tracks);
      const candidateMimes =
        effectiveFormat === 'mp4'
          ? ['video/mp4;codecs=avc1,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']
          : ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];

      const chosenMime = candidateMimes.find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';
      const isActualMp4 = chosenMime.includes('mp4');
      const realExt = isActualMp4 ? 'mp4' : 'webm';
      const realLabel = isActualMp4 ? 'MP4' : 'WEBM (VP8/VP9 + Opus)';

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: chosenMime,
        videoBitsPerSecond: effectiveQuality === 'max' ? 8_000_000 : effectiveQuality === 'high' ? 4_800_000 : 2_500_000
      });
      activeRecorderRef.current = recorder;

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        if (recAudioSrc) {
          try {
            recAudioSrc.stop();
          } catch {}
        }
        if (recAudioCtx) recAudioCtx.close();
        tracks.forEach((tr) => tr.stop());

        if (cancelExportRef.current) {
          chunks.length = 0;
          showToast('Exportación cancelada.', 'info');
          finalizeAndRelease();
          return;
        }

        const blob = new Blob(chunks, { type: chosenMime });
        chunks.length = 0;
        const elapsedFinal = Number(((performance.now() - exportStartPerf) / 1000).toFixed(1));
        const url = URL.createObjectURL(blob);
        const fname = `JairRestaura_Evangelista_${res.width}x${res.height}_${durationSec}s.${realExt}`;

        setExportedBlob(blob);
        setExportedFileName(fname);
        setExportedUrl(url);
        setExportProgress(100);
        setExportStatusText(`¡Video ${realExt.toUpperCase()} listo en ${elapsedFinal}s!`);
        setTelemetry({
          percent: 100,
          currentFrame: exactTotalFrames,
          totalFrames: exactTotalFrames,
          elapsedSec: elapsedFinal,
          engineLabel: 'MediaRecorder Local',
          finalDurationSec: durationSec,
          fileSizeText: formatFileSize(blob.size),
          actualFormatLabel: realLabel
        });

        if (autoDownload) triggerDownload(url, fname);
        showToast(`¡Video ${realExt.toUpperCase()} exportado con éxito!`, 'success');
        finalizeAndRelease();
      };

      recorder.start(200);
      const startPerf = performance.now();

      const recordLoop = (now: number) => {
        if (cancelExportRef.current) {
          if (recorder.state !== 'inactive') recorder.stop();
          return;
        }
        const elapsedSec = (now - startPerf) / 1000;
        if (elapsedSec >= durationSec) {
          if (recorder.state !== 'inactive') recorder.stop();
          return;
        }
        renderSceneAtTime(offCtx, res.width, res.height, elapsedSec, durationSec);
        const pct = Math.min(99, Math.round((elapsedSec / durationSec) * 100));
        const processedFrames = Math.min(exactTotalFrames, Math.round(elapsedSec * effectiveFps));
        setExportProgress(pct);
        setExportStatusText(`Renderizando ${realExt.toUpperCase()}: ${elapsedSec.toFixed(1)}s / ${durationSec}s...`);
        setTelemetry({
          percent: pct,
          currentFrame: processedFrames,
          totalFrames: exactTotalFrames,
          elapsedSec: Number(elapsedSec.toFixed(1)),
          engineLabel: 'MediaRecorder Local',
          finalDurationSec: durationSec,
          fileSizeText: '',
          actualFormatLabel: realLabel
        });
        requestAnimationFrame(recordLoop);
      };

      requestAnimationFrame(recordLoop);
    } catch (err) {
      console.error(err);
      showToast('No se pudo completar la exportación. Intenta con la modalidad RÁPIDA.', 'error');
      finalizeAndRelease();
    }
  };

  // Compartir en WhatsApp / Redes Sociales
  const handleShare = async () => {
    const shareMessage =
      '✨ JAIRRESTAURA EVANGELISTA ✨\n"PROCLAMANDO A CRISTO, ESPERANZA Y SALVACIÓN."\n¡Jesucristo te ama! Hoy es el día de tu salvación.';

    if (exportedBlob && navigator.share) {
      try {
        const file = new File([exportedBlob], exportedFileName, { type: exportedBlob.type });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'JairRestaura Evangelista',
            text: shareMessage,
            files: [file]
          });
          return;
        }
      } catch {
        // Si el usuario cancela o no soporta archivos, abrir WhatsApp Web
      }
    }

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // ============================================================================
  // HELPERS DE GESTIÓN DE CAPAS DE TEXTO
  // ============================================================================

  const selectedLayer = textLayers.find((l) => l.id === selectedLayerId) || textLayers[0];

  const updateSelectedLayer = (patch: Partial<TextLayer>) => {
    if (!selectedLayer) return;
    setTextLayers((prev) => prev.map((l) => (l.id === selectedLayer.id ? { ...l, ...patch } : l)));
  };

  const addNewTextLayer = (initialText = '¡VEN A CRISTO!') => {
    const newId = `layer-${Date.now()}`;
    const newLayer: TextLayer = {
      id: newId,
      text: initialText,
      x: 50,
      y: 50,
      fontSize: 44,
      color: 'gold',
      effect: 'gold-shine',
      visible: true
    };
    setTextLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newId);
    showToast('Nueva capa de texto agregada.', 'success');
  };

  const deleteTextLayer = (id: string) => {
    if (textLayers.length <= 1) {
      showToast('Debe existir al menos una capa de texto.', 'info');
      return;
    }
    setTextLayers((prev) => {
      const next = prev.filter((l) => l.id !== id);
      if (selectedLayerId === id && next[0]) setSelectedLayerId(next[0].id);
      return next;
    });
  };

  const currentAspect = RESOLUTIONS[resolutionKey].aspect;

  // ============================================================================
  // INTERFAZ DE USUARIO CINEMATOGRÁFICA
  // ============================================================================

  return (
    <div className="min-h-screen bg-[#05070e] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Cargar fuentes épicas */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        .font-cinzel { font-family: 'Cinzel', Georgia, serif; }
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        input[type="range"] { accent-color: #f59e0b; }
      `}</style>

      {/* ENCABEZADO IDENTIDAD JAIRRESTAURA EVANGELISTA */}
      <header className="sticky top-0 z-30 border-b border-amber-500/20 bg-[#070a14]/95 backdrop-blur-md px-4 lg:px-8 py-3">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logotipo y Eslogan */}
          <div className="flex items-center gap-3.5">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 p-[1.5px] shadow-lg shadow-amber-500/25">
              <div className="w-full h-full rounded-[10px] bg-[#090d1a] flex items-center justify-center">
                <Cross className="w-6 h-6 text-amber-400" strokeWidth={2.4} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-cinzel text-base sm:text-lg lg:text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500">
                  JAIRRESTAURA EVANGELISTA
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300">
                  Estudio de Animación Cristiana
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-200/75 font-medium tracking-wide">
                PROCLAMANDO A CRISTO, ESPERANZA Y SALVACIÓN.
              </p>
            </div>
          </div>

          {/* Botón rápido de exportación en barra superior */}
          <div className="flex items-center gap-2.5">
            <span className="hidden xl:inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Gratuito • Sin Marcas de Agua
            </span>
            <button
              onClick={() => {
                setActiveTab('export');
                handleExport({ mode: 'fast', format: 'mp4', autoDownload: true });
              }}
              disabled={isExporting}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/30 hover:brightness-110 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>⚡ EXPORTACIÓN INSTANTÁNEA</span>
            </button>
          </div>
        </div>
      </header>

      {/* NOTIFICACIÓN FLOTANTE (SIN ALERT) */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900/95 border border-amber-500/50 text-sm shadow-2xl backdrop-blur-md flex items-center gap-2.5 animate-fade-in">
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span className="text-slate-100 font-medium">{toast.text}</span>
        </div>
      )}

      {/* ÁREA DE TRABAJO PRINCIPAL DE 3 ZONAS */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ZONA 1: PANEL IZQUIERDO DE HERRAMIENTAS (4 COLUMNAS EN DESKTOP) */}
        <section className="lg:col-span-4 bg-[#0b101e] border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Navegación por Pestañas */}
          <div className="grid grid-cols-5 border-b border-slate-800 bg-[#080c17]">
            {[
              { id: 'image', label: 'Imagen', icon: ImageIcon },
              { id: 'effects', label: 'Efectos', icon: Sparkles },
              { id: 'text', label: 'Textos', icon: Type },
              { id: 'audio', label: 'Audio', icon: Music },
              { id: 'export', label: 'Exportar', icon: Film }
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`py-3 px-1 flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition border-b-2 ${
                    active
                      ? 'border-amber-400 text-amber-300 bg-amber-500/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Contenido de cada Pestaña */}
          <div className="p-4 sm:p-5 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* PESTAÑA 1: IMAGEN Y ENCUADRE */}
            {activeTab === 'image' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-1">
                    1. Carga y Encuadre de Imagen
                  </h2>
                  <p className="text-xs text-slate-400">
                    Conservamos tu imagen original intacta sin alterar rostros. Soporta JPG, PNG y WEBP.
                  </p>
                </div>

                {/* Zona Drag & Drop */}
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingFile(true);
                  }}
                  onDragLeave={() => setIsDraggingFile(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingFile(false);
                    const f = e.dataTransfer.files?.[0];
                    if (f) handleImageFile(f);
                  }}
                  className={`block cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center transition ${
                    isDraggingFile
                      ? 'border-amber-400 bg-amber-500/15'
                      : 'border-slate-700 hover:border-amber-500/60 bg-slate-950/60'
                  }`}
                >
                  <Upload className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">Haz clic o arrastra tu imagen aquí</p>
                  <p className="text-xs text-slate-400 mt-1 truncate">Actual: {imageName}</p>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleImageFile(f);
                    }}
                  />
                </label>

                {/* Selector de Formato de Pantalla */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">Formato de Pantalla</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { res: '720x720' as ResolutionKey, title: 'Cuadrado 1:1', sub: 'Rápido / Feed' },
                      { res: '720x1280' as ResolutionKey, title: 'Vertical 9:16', sub: 'Reels / TikTok' },
                      { res: '1920x1080' as ResolutionKey, title: 'Horizontal 16:9', sub: 'YouTube / TV' }
                    ].map((fmt) => (
                      <button
                        key={fmt.res}
                        onClick={() => setResolutionKey(fmt.res)}
                        className={`p-2.5 rounded-xl border text-left transition ${
                          RESOLUTIONS[resolutionKey].aspect === RESOLUTIONS[fmt.res].aspect
                            ? 'border-amber-400 bg-amber-500/15 text-amber-200'
                            : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{fmt.title}</div>
                        <div className="text-[10px] opacity-75">{fmt.sub}</div>
                      </button>                    ))}
                  </div>
                </div>

                {/* Controles de Zoom y Posición */}
                <div className="space-y-3.5 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                      Ampliar / Reducir ({Math.round(framing.scale * 100)}%)
                    </span>
                    <button
                      onClick={() => setFraming({ scale: 1, offsetX: 0, offsetY: 0 })}
                      className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Centrar
                    </button>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="250"
                    value={Math.round(framing.scale * 100)}
                    onChange={(e) => setFraming((p) => ({ ...p, scale: Number(e.target.value) / 100 }))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Posición X</span>
                        <span>{framing.offsetX}px</span>
                      </div>
                      <input
                        type="range"
                        min="-400"
                        max="400"
                        value={framing.offsetX}
                        onChange={(e) => setFraming((p) => ({ ...p, offsetX: Number(e.target.value) }))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Posición Y</span>
                        <span>{framing.offsetY}px</span>
                      </div>
                      <input
                        type="range"
                        min="-400"
                        max="400"
                        value={framing.offsetY}
                        onChange={(e) => setFraming((p) => ({ ...p, offsetY: Number(e.target.value) }))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Move className="w-3 h-3 text-amber-400" />
                    Consejo: También puedes arrastrar la imagen directamente sobre el lienzo.
                  </p>
                </div>
              </div>
            )}

            {/* PESTAÑA 2: MOVIMIENTO DE CÁMARA Y EFECTOS CELESTIALES */}
            {activeTab === 'effects' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-1">
                    2. Animación y Efectos Celestiales
                  </h2>
                  <p className="text-xs text-slate-400">
                    Activa, desactiva y gradúa cada efecto de luz en tiempo real.
                  </p>
                </div>

                {/* Movimiento de Cámara */}
                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-3">
                  <label className="text-xs font-bold text-white block">Movimiento de Cámara</label>
                  <select
                    value={cameraMode}
                    onChange={(e) => setCameraMode(e.target.value as CameraMode)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:border-amber-400 outline-none"
                  >
                    <option value="cinematic-in">Acercamiento Cinematográfico (Lento)</option>
                    <option value="progressive-zoom">Zoom Progresivo (Respiración)</option>
                    <option value="smooth-out">Alejamiento Suave</option>
                    <option value="pan-sweep">Movimiento Panorámico Horizontal</option>
                    <option value="depth-3d">Efecto de Profundidad 3D Sutil</option>
                    <option value="static">Cámara Estática</option>
                  </select>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Intensidad de Movimiento</span>
                      <span className="text-amber-400 font-bold">{cameraIntensity}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={cameraIntensity}
                      onChange={(e) => setCameraIntensity(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Interruptores e Intensidades de Efectos */}
                <div className="space-y-3">
                  {[
                    {
                      key: 'rays' as const,
                      intKey: 'raysIntensity' as const,
                      label: 'Rayos de Luz Celestial',
                      desc: 'Haces dorados giratorios desde lo alto'
                    },
                    {
                      key: 'crossGlow' as const,
                      intKey: 'crossIntensity' as const,
                      label: 'Iluminación de la Cruz',
                      desc: 'Resplandor pulsante en punto focal'
                    },
                    {
                      key: 'particles' as const,
                      intKey: 'particlesIntensity' as const,
                      label: 'Partículas Ascendentes y Polvo Luminoso',
                      desc: 'Motas de gloria flotando hacia arriba'
                    },
                    {
                      key: 'flares' as const,
                      intKey: 'flaresIntensity' as const,
                      label: 'Destellos Dorados (Sparkles)',
                      desc: 'Centelleos estelares en escena'
                    },
                    {
                      key: 'warmAura' as const,
                      intKey: 'warmAuraIntensity' as const,
                      label: 'Atmósfera Celestial Cálida',
                      desc: 'Baño de luz dorada envolvente'
                    }
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-100">{item.label}</div>
                          <div className="text-[10px] text-slate-400">{item.desc}</div>
                        </div>
                        <button
                          onClick={() => setEffects((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                          className={`w-11 h-6 rounded-full transition p-0.5 ${
                            effects[item.key] ? 'bg-amber-500' : 'bg-slate-700'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full bg-white transition-transform ${
                              effects[item.key] ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {effects[item.key] && (
                        <div className="pt-1">
                          <div className="flex justify-between text-[10px] text-amber-300/90 mb-1">
                            <span>Intensidad</span>
                            <span>{effects[item.intKey]}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            value={effects[item.intKey]}
                            onChange={(e) =>
                              setEffects((prev) => ({ ...prev, [item.intKey]: Number(e.target.value) }))
                            }
                            className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Posición del punto de luz de la cruz */}
                {effects.crossGlow && (
                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-amber-500/25 space-y-2">
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5" />
                      Ubicación del Foco de Luz / Cruz
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400">Horizontal: {effects.crossX}%</span>
                        <input
                          type="range"
                          min="10"
                          max="90"
                          value={effects.crossX}
                          onChange={(e) => setEffects((p) => ({ ...p, crossX: Number(e.target.value) }))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400">Vertical: {effects.crossY}%</span>
                        <input
                          type="range"
                          min="10"
                          max="85"
                          value={effects.crossY}
                          onChange={(e) => setEffects((p) => ({ ...p, crossY: Number(e.target.value) }))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PESTAÑA 3: MÓDULO DE TEXTO Y MENSAJES BÍBLICOS */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                      3. Mensajes Bíblicos y Títulos
                    </h2>
                    <p className="text-xs text-slate-400">Edita, mueve o añade frases evangelísticas.</p>
                  </div>
                  <button
                    onClick={() => addNewTextLayer()}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Añadir
                  </button>
                </div>

                {/* Lista de capas */}
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {textLayers.map((layer) => (
                    <div
                      key={layer.id}
                      onClick={() => setSelectedLayerId(layer.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between gap-2 transition ${
                        selectedLayer?.id === layer.id
                          ? 'border-amber-400 bg-amber-500/15'
                          : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-xs font-semibold truncate">{layer.text || '(Vacío)'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTextLayers((prev) =>
                              prev.map((l) => (l.id === layer.id ? { ...l, visible: !l.visible } : l))
                            );
                          }}
                          className={`p-1 rounded ${layer.visible ? 'text-amber-300' : 'text-slate-600'}`}
                          title="Mostrar/Ocultar"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTextLayer(layer.id);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-red-400"
                          title="Eliminar capa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Editor de la capa seleccionada */}
                {selectedLayer && (
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">Texto de la Capa</label>
                      <input
                        type="text"
                        value={selectedLayer.text}
                        onChange={(e) => updateSelectedLayer({ text: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 outline-none"
                        placeholder="Escribe un versículo o mensaje..."
                      />
                    </div>

                    {/* Presets rápidos con 1 clic */}
                    <div>
                      <span className="text-[10px] font-bold text-amber-300/90 block mb-1.5">
                        Frases Predeterminadas (1 clic):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {BIBLICAL_PRESETS.map((preset) => (
                          <button
                            key={preset}
                            onClick={() => updateSelectedLayer({ text: preset })}
                            className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-amber-500/20 border border-slate-800 hover:border-amber-400/40 text-[10px] text-slate-300 transition"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color y Efecto Tipográfico */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Color</label>
                        <select
                          value={selectedLayer.color}
                          onChange={(e) => updateSelectedLayer({ color: e.target.value as TextLayer['color'] })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        >
                          <option value="gold">Dorado Celestial</option>
                          <option value="white">Blanco Luminoso</option>
                          <option value="warm">Crema Cálido</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Animación de Texto</label>
                        <select
                          value={selectedLayer.effect}
                          onChange={(e) =>
                            updateSelectedLayer({ effect: e.target.value as TextAnimEffect })
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        >
                          <option value="gold-shine">Brillo Metálico Dorado</option>
                          <option value="fade-in">Aparición Progresiva</option>
                          <option value="glow-pulse">Pulso Luminoso</option>
                          <option value="fade-out-end">Desvanecimiento Final</option>
                          <option value="none">Fijo Elegante</option>
                        </select>
                      </div>
                    </div>

                    {/* Tamaño y Posición X/Y */}
                    <div className="space-y-2 pt-1">
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Tamaño de Letra</span>
                          <span>{selectedLayer.fontSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="22"
                          max="95"
                          value={selectedLayer.fontSize}
                          onChange={(e) => updateSelectedLayer({ fontSize: Number(e.target.value) })}
                          className="w-full h-1.5 bg-slate-800 rounded-lg"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[10px] text-slate-400">Posición X: {selectedLayer.x}%</span>
                          <input
                            type="range"
                            min="10"
                            max="90"
                            value={selectedLayer.x}
                            onChange={(e) => updateSelectedLayer({ x: Number(e.target.value) })}
                            className="w-full h-1.5 bg-slate-800 rounded-lg"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400">Posición Y: {selectedLayer.y}%</span>
                          <input
                            type="range"
                            min="5"
                            max="95"
                            value={selectedLayer.y}
                            onChange={(e) => updateSelectedLayer({ y: Number(e.target.value) })}
                            className="w-full h-1.5 bg-slate-800 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PESTAÑA 4: MÓDULO DE AUDIO Y JINGLES */}
            {activeTab === 'audio' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-1">
                    4. Audio, Música y Jingles
                  </h2>
                  <p className="text-xs text-slate-400">
                    Incorpora tu jingle MP3/WAV o usa nuestro fondo instrumental celestial gratuito.
                  </p>
                </div>

                {/* Cargar archivo MP3 / WAV */}
                <label className="block cursor-pointer rounded-2xl border border-dashed border-sky-500/40 hover:border-sky-400 bg-sky-950/20 p-4 text-center transition">
                  <Music className="w-7 h-7 text-sky-400 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-sky-200">Cargar Jingle o Música (MP3, WAV, OGG)</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {audioFileName ? `Cargado: ${audioFileName}` : 'Selecciona el jingle de JAIRRESTAURA'}
                  </p>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleAudioFile(f);
                    }}
                  />
                </label>

                {/* Selector de Fuente de Audio */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">Pista Activa para el Video</label>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => {
                        if (!userAudioBufferRef.current) {
                          showToast('Primero carga un archivo MP3 o WAV arriba.', 'info');
                          return;
                        }
                        setAudioSourceType('file');
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                        audioSourceType === 'file'
                          ? 'border-amber-400 bg-amber-500/15 text-amber-200'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">Mi Jingle / Audio Cargado</div>
                        <div className="text-[10px] opacity-75">
                          {audioFileName || 'Ningún archivo seleccionado aún'}
                        </div>
                      </div>
                      {audioSourceType === 'file' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </button>

                    <button
                      onClick={() => setAudioSourceType('celestial-synth')}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                        audioSourceType === 'celestial-synth'
                          ? 'border-amber-400 bg-amber-500/15 text-amber-200'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">Ambiente Celestial Instrumental</div>
                        <div className="text-[10px] opacity-75">Acordes épicos de adoración generados localmente</div>
                      </div>
                      {audioSourceType === 'celestial-synth' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </button>

                    <button
                      onClick={() => setAudioSourceType('none')}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                        audioSourceType === 'none'
                          ? 'border-amber-400 bg-amber-500/15 text-amber-200'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">Sin Audio (Silencio)</div>
                        <div className="text-[10px] opacity-75">Exportar únicamente la animación visual</div>
                      </div>
                      {audioSourceType === 'none' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                    </button>
                  </div>
                </div>

                {/* Controles de Volumen y Punto de Inicio */}
                {audioSourceType !== 'none' && (
                  <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span className="flex items-center gap-1.5 font-bold">
                          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                          Volumen de Audio
                        </span>
                        <span className="text-amber-400 font-bold">{audioVolume}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={audioVolume}
                        onChange={(e) => setAudioVolume(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {audioSourceType === 'file' && audioDurationSec > 0 && (
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span className="font-bold">Punto de Inicio del Jingle</span>
                          <span className="text-sky-300 font-mono">{audioStartOffset.toFixed(1)}s</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max={Math.max(0, audioDurationSec - 1)}
                          step="0.5"
                          value={audioStartOffset}
                          onChange={(e) => setAudioStartOffset(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* PESTAÑA 5: EXPORTACIÓN PROFESIONAL ULTRARRÁPIDA */}
            {activeTab === 'export' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-1">
                    5. Exportación Ultrarrápida Local
                  </h2>
                  <p className="text-xs text-slate-400">
                    Aceleración por hardware local en tu dispositivo con audio original sincronizado.
                  </p>
                </div>

                {/* BOTÓN PRINCIPAL EXPORTACIÓN INSTANTÁNEA */}
                <button
                  onClick={() => handleExport({ mode: 'fast', format: 'mp4', autoDownload: true })}
                  disabled={isExporting}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>⚡ EXPORTACIÓN INSTANTÁNEA (RÁPIDA MP4)</span>
                </button>

                {/* 3 MODALIDADES AUTOMÁTICAS */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-amber-400" />
                    Modalidad Automática de Velocidad y Calidad
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {(['fast', 'recommended', 'professional'] as ExportPresetMode[]).map((mKey) => {
                      const m = EXPORT_MODALITIES[mKey];
                      const active = presetMode === mKey;
                      return (
                        <button
                          key={mKey}
                          onClick={() => applyPresetMode(mKey)}
                          disabled={isExporting}
                          className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                            active
                              ? 'border-amber-400 bg-amber-500/15 text-amber-100'
                              : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black tracking-wide">{m.title}</span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                                {m.badge}
                              </span>
                            </div>
                            <div className="text-[11px] opacity-80 mt-0.5">{m.desc}</div>
                          </div>
                          {active && <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Formato de Salida */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'mp4' as ExportFormat, title: 'Video MP4', desc: 'H.264 + AAC (Universal)' },
                    { id: 'webm' as ExportFormat, title: 'Video WEBM', desc: 'VP8/VP9 + Opus' },
                    { id: 'gif' as ExportFormat, title: 'GIF Animado', desc: 'Bucle sin audio' },
                    { id: 'png' as ExportFormat, title: 'Imagen PNG', desc: 'Captura HD actual' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setExportFormat(f.id)}
                      disabled={isExporting}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        exportFormat === f.id
                          ? 'border-amber-400 bg-amber-500/15 text-amber-200'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-extrabold">{f.title}</div>
                      <div className="text-[10px] opacity-75">{f.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Resolución */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Resolución de Salida</label>
                  <select
                    value={resolutionKey}
                    disabled={isExporting}
                    onChange={(e) => setResolutionKey(e.target.value as ResolutionKey)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {Object.entries(RESOLUTIONS).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duración, FPS y Calidad */}
                {exportFormat !== 'png' && (
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Duración</label>
                      <select
                        value={durationSec}
                        disabled={isExporting}
                        onChange={(e) => {
                          setDurationSec(Number(e.target.value));
                          timeRef.current = 0;
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white"
                      >
                        <option value={10}>10 seg</option>
                        <option value={15}>15 seg</option>
                        <option value={20}>20 seg</option>
                        <option value={30}>30 seg</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Velocidad</label>
                      <select
                        value={fps}
                        disabled={isExporting}
                        onChange={(e) => setFps(Number(e.target.value) as 24 | 25 | 30)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white"
                      >
                        <option value={24}>24 FPS</option>
                        <option value={25}>25 FPS</option>
                        <option value={30}>30 FPS</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Calidad</label>
                      <select
                        value={quality}
                        disabled={isExporting}
                        onChange={(e) => setQuality(e.target.value as ExportQuality)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white"
                      >
                        <option value="standard">Estándar</option>
                        <option value="high">Alta</option>
                        <option value="max">Máxima</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Botón Personalizado de Exportación o Cancelación */}
                {!isExporting ? (
                  <button
                    onClick={() => handleExport({ autoDownload: false })}
                    className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-200 font-extrabold text-xs transition flex items-center justify-center gap-2"
                  >
                    <Wand2 className="w-4 h-4 text-amber-400" />
                    <span>
                      Exportar {exportFormat.toUpperCase()} ({Math.round(durationSec * fps)} fotogramas exactos)
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={handleCancelExport}
                    className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>CANCELAR EXPORTACIÓN</span>
                  </button>
                )}

                {/* Telemetría y Barra de Progreso Real */}
                {isExporting && (
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-500/40 space-y-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-amber-300 font-bold truncate pr-2">{exportStatusText}</span>
                      <span className="text-white font-black">{exportProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-400 transition-all duration-100"
                        style={{ width: `${exportProgress}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-1 pt-1 text-[10px] text-slate-400 font-mono">
                      <div>
                        Frames: <span className="text-slate-200">{telemetry.currentFrame}/{telemetry.totalFrames}</span>
                      </div>
                      <div className="text-center">
                        Tiempo: <span className="text-amber-300">{telemetry.elapsedSec.toFixed(1)}s</span>
                      </div>
                      <div className="text-right truncate">{telemetry.engineLabel}</div>
                    </div>
                  </div>
                )}

                {/* Resultado Listo con Detalles Técnicos, Botón Descargar y Compartir */}
                {exportedUrl && !isExporting && (
                  <div className="bg-emerald-950/35 border border-emerald-500/40 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span className="truncate">{exportedFileName}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px] bg-slate-950/70 p-2 rounded-lg border border-emerald-500/20 text-slate-300">
                      <div>
                        <span className="text-slate-500 block">Duración Final</span>
                        <span className="font-bold text-white">{telemetry.finalDurationSec}s ({telemetry.totalFrames} f)</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Tamaño Archivo</span>
                        <span className="font-bold text-emerald-300">{telemetry.fileSizeText}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Tiempo Render</span>
                        <span className="font-bold text-amber-300">{telemetry.elapsedSec}s</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={exportedUrl}
                        download={exportedFileName}
                        className="py-2.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Download className="w-3.5 h-3.5" /> DESCARGAR VIDEO
                      </a>
                      <button
                        onClick={handleShare}
                        className="py-2.5 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Share2 className="w-3.5 h-3.5" /> COMPARTIR
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ZONA 2: VISTA PREVIA CENTRAL DEL LIENZO EN ALTA DEFINICIÓN (5 COLUMNAS) */}
        <section className="lg:col-span-5 flex flex-col items-center justify-center gap-4">
          <div className="w-full bg-[#090d1a] border border-slate-800/90 rounded-2xl p-3 sm:p-5 flex flex-col items-center justify-center shadow-2xl relative">
            {/* Contenedor con relación de aspecto dinámica */}
            <div
              className="relative rounded-xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.2)] bg-black flex items-center justify-center"
              style={{
                aspectRatio:
                  currentAspect === '9:16' ? '9 / 16' : currentAspect === '16:9' ? '16 / 9' : '1 / 1',
                maxHeight: '64vh',
                width: currentAspect === '16:9' ? '100%' : 'auto',
                maxWidth: '100%'
              }}
            >
              <canvas
                ref={previewCanvasRef}
                onPointerDown={handleCanvasPointerDown}
                onPointerMove={handleCanvasPointerMove}
                onPointerUp={handleCanvasPointerUp}
                onPointerLeave={handleCanvasPointerUp}
                className="w-full h-full object-contain block cursor-grab active:cursor-grabbing touch-none"
              />

              {/* Etiqueta de Resolución Activa */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/65 backdrop-blur-md border border-white/10 text-[10px] font-bold text-amber-200 pointer-events-none">
                {resolutionKey.replace('x', ' × ')} • {fps} FPS
              </div>
            </div>

            {/* Barra de Reproducción y Línea de Tiempo */}
            <div className="w-full mt-4 bg-slate-950/90 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
              <button
                onClick={() => setIsPlaying((p) => !p)}
                className="w-9 h-9 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 transition"
                title={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  timeRef.current = 0;
                  setCurrentTimeSec(0);
                  stopLiveAudio();
                }}
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center shrink-0 transition"
                title="Detener y volver al inicio"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>

              <div className="flex-1 flex flex-col gap-1">
                <input
                  type="range"
                  min="0"
                  max={durationSec}
                  step="0.05"
                  value={currentTimeSec}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    timeRef.current = val;
                    setCurrentTimeSec(val);
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>{currentTimeSec.toFixed(1)}s</span>
                  <span>Duración: {durationSec}s</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ZONA 3: PANEL DERECHO DE RESUMEN Y ACCESO RÁPIDO (3 COLUMNAS) */}
        <aside className="lg:col-span-3 bg-[#0b101e] border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-5 shadow-2xl">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Resumen del Proyecto
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Todo el procesamiento ocurre localmente en tu dispositivo con privacidad total.
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex justify-between items-center">
              <span className="text-slate-400">Fotogramas Exactos</span>
              <span className="font-bold text-amber-300">
                {Math.round(durationSec * fps)} frames ({fps} FPS)
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex justify-between items-center">
              <span className="text-slate-400">Audio</span>
              <span className="font-bold text-sky-300 truncate max-w-[140px]">
                {audioSourceType === 'file'
                  ? audioFileName
                  : audioSourceType === 'celestial-synth'
                  ? 'Ambiente Celestial'
                  : 'Silencio'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex justify-between items-center">
              <span className="text-slate-400">Capas de Texto</span>
              <span className="font-bold text-amber-300">{textLayers.filter((l) => l.visible).length} activas</span>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="space-y-2.5 pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setActiveTab('export');
                handleExport({ mode: 'fast', format: 'mp4', autoDownload: true });
              }}
              disabled={isExporting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>⚡ EXPORTACIÓN INSTANTÁNEA</span>
            </button>

            <button
              onClick={() => {
                handleExport({ format: 'png' });
              }}
              disabled={isExporting}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FileImage className="w-4 h-4 text-amber-400" />
              <span>Capturar Fotograma PNG</span>
            </button>

            <button
              onClick={handleShare}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartir en WhatsApp</span>
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}