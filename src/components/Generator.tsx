import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, Sparkles, Copy, Download, RefreshCw, X, Check, Zap } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { analyzeImage, formatPrompt, remixPrompt } from '@/src/services/gemini';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export const Generator = ({ onHistoryUpdate }: { onHistoryUpdate: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [displayText, setDisplayText] = useState("");
  const typingIntervalRef = useRef<any>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
      setDisplayText("");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [extraStyle, setExtraStyle] = useState("");
  const [engine, setEngine] = useState("midjourney");
  const [isIndonesian, setIsIndonesian] = useState(false);

  const handleGenerate = async () => {
    if (!preview || !file) return;

    setIsAnalyzing(true);
    setDisplayText("");
    const loadingToast = toast.loading("AI is analyzing your image...");

    try {
      const details = await analyzeImage(preview, file.type);
      let formattedPrompt = formatPrompt(details, { ar: aspectRatio, extraStyle });
      
      if (engine === "stable-diffusion") {
        formattedPrompt = formattedPrompt.replace("--ar", "--aspect") + ", highres, masterpiece, 8k";
      }

      setResult({ details, prompt: formattedPrompt });
      
      // Save to history
      const history = JSON.parse(localStorage.getItem('prompt_history') || '[]');
      const newItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageUrl: preview,
        prompt: formattedPrompt,
        details
      };
      localStorage.setItem('prompt_history', JSON.stringify([newItem, ...history].slice(0, 50)));
      onHistoryUpdate();

      toast.success("Prompt generated successfully!", { id: loadingToast });
      startTypingAnimation(formattedPrompt);
    } catch (error) {
      toast.error("Failed to analyze image. Please try again.", { id: loadingToast });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startTypingAnimation = (text: string) => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    
    let i = 0;
    setDisplayText("");
    typingIntervalRef.current = setInterval(() => {
      setDisplayText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(typingIntervalRef.current);
    }, 5);
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.prompt);
    toast.success("Copied to clipboard!");
  };

  const downloadTxt = () => {
    if (!result) return;
    const element = document.createElement("a");
    const file = new Blob([result.prompt], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `xyraa-prompt-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    toast.success("Downloaded as TXT!");
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setDisplayText("");
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
  };

  const [isRemixing, setIsRemixing] = useState(false);

  const handleRemix = async (flavor: string) => {
    if (!result) return;
    setIsRemixing(true);
    const remixToast = toast.loading(`Remixing with ${flavor} flavor...`);
    try {
      const remixed = await remixPrompt(result.prompt, flavor);
      setResult({ ...result, prompt: remixed });
      startTypingAnimation(remixed || "");
      toast.success("Remixed!", { id: remixToast });
    } catch (e) {
      toast.error("Remix failed", { id: remixToast });
    } finally {
      setIsRemixing(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block"
        >
          <Badge className="mb-4 text-sm px-4 py-2 bg-[#FFDE00] text-black">New: Gemini 3 Integration</Badge>
        </motion.div>
        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
          CYBERNETIC <br />
          <span className="text-[#FF00F5] outline-text shadow-sm">VISION</span> TOOL
        </h2>
        <p className="max-w-2xl mx-auto text-xl font-bold opacity-80">
          Transform any image into a detailed Midjourney-ready cinematic prompt in seconds.
        </p>
      </section>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Upload */}
        <div className="space-y-6">
          <Card className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2">
              <Badge>v1.0</Badge>
            </div>
            
            {!preview ? (
              <div 
                {...getRootProps()} 
                className={`border-4 border-dashed border-black p-12 text-center cursor-pointer transition-all ${isDragActive ? 'bg-zinc-100 scale-[0.98]' : 'bg-white'}`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-4">
                  <div className="p-6 bg-[#00E0FF] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">
                    <Upload size={48} />
                  </div>
                  <p className="text-2xl font-black uppercase">Drop image here</p>
                  <p className="font-bold opacity-60 uppercase text-sm tracking-widest">or click to browse files</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-black overflow-hidden aspect-video flex items-center justify-center">
                  <img src={preview} alt="Preview" className="max-h-full object-contain" />
                  <button 
                    onClick={reset}
                    className="absolute top-4 right-4 bg-red-500 border-4 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    <X size={24} className="text-white" />
                  </button>
                  
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-6">
                      <motion.div
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="absolute left-0 w-full h-1 bg-[#00E0FF] shadow-[0_0_20px_#00E0FF]"
                      />
                      <RefreshCw className="animate-spin mb-4" size={48} />
                      <p className="font-black uppercase text-xl animate-pulse">Deep Scanning...</p>
                    </div>
                  )}
                </div>

                {!isAnalyzing && !result && (
                  <div className="space-y-6">
                    {/* Aspect Ratio Selector */}
                    <div className="space-y-2">
                      <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Aspect Ratio</p>
                      <div className="flex gap-2 flex-wrap">
                        {["1:1", "16:9", "9:16", "2:3", "4:5"].map((ar) => (
                          <button
                            key={ar}
                            onClick={() => setAspectRatio(ar)}
                            className={cn(
                              "px-3 py-1 border-2 border-black font-bold text-xs transition-all",
                              aspectRatio === ar ? "bg-black text-white" : "bg-white dark:bg-zinc-700"
                            )}
                          >
                            {ar}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Style Modifiers */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Engine Optimize</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEngine("midjourney")}
                            className={cn(
                              "flex-1 py-1 border-2 border-black font-bold text-[10px] uppercase transition-all",
                              engine === "midjourney" ? "bg-blue-600 text-white" : "bg-white dark:bg-zinc-700"
                            )}
                          >
                            Midjourney
                          </button>
                          <button
                            onClick={() => setEngine("stable-diffusion")}
                            className={cn(
                              "flex-1 py-1 border-2 border-black font-bold text-[10px] uppercase transition-all",
                              engine === "stable-diffusion" ? "bg-purple-600 text-white" : "bg-white dark:bg-zinc-700"
                            )}
                          >
                            Stable Diffusion
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Style Booster</p>
                        <div className="flex gap-2 flex-wrap">
                        {[
                          { label: "Default", value: "" },
                          { label: "Anime", value: "Studio Ghibli style, vibrant colors" },
                          { label: "8k", value: "Unreal Engine 5, Octane Render, 8k" },
                          { label: "Retrowave", value: "80s synthwave aesthetic, neon purple" },
                          { label: "Vintage", value: "35mm film grain, nostalgic" },
                          { label: "Batik", value: "Indonesian Batik patterns integration, intricate wax-resist dyeing" },
                          { label: "Cyber-Bali", value: "Balinese temple architecture, futuristic cyberpunk neon" }
                        ].map((s) => (
                          <button
                            key={s.label}
                            onClick={() => setExtraStyle(s.value)}
                            className={cn(
                              "px-3 py-1 border-2 border-black font-bold text-[10px] uppercase transition-all",
                              extraStyle === s.value ? "bg-[#FF00F5] text-white" : "bg-white dark:bg-zinc-700"
                            )}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={handleGenerate} 
                      className="w-full text-2xl py-6"
                      variant="primary"
                    >
                      <Sparkles className="mr-2" /> GENERATE PROMPT
                    </Button>
                  </div>
                </div>
              )}
                
              {result && (
                  <Button 
                    onClick={handleGenerate} 
                    variant="secondary"
                    className="w-full text-xl py-4"
                  >
                    <RefreshCw className="mr-2" size={20} /> REGENERATE
                  </Button>
                )}
              </div>
            )}
          </Card>

          <Card className="bg-black text-white">
            <h3 className="font-black uppercase text-sm tracking-widest mb-4 flex items-center gap-2">
              <Zap className="text-[#FFDE00]" size={16} /> Pro Tips
            </h3>
            <ul className="text-xs font-bold space-y-2 opacity-80 uppercase">
              <li>• Use high-contrast images for better style detection</li>
              <li>• Wide shots work best for environmental metadata</li>
              <li>• Cinematic prompts are optimized for SDXL and Midjourney v6</li>
            </ul>
          </Card>
        </div>

        {/* Right Column: Result */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {!result && !isAnalyzing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center p-12 border-4 border-black border-dashed opacity-30"
              >
                <ImageIcon size={120} strokeWidth={1} />
                <p className="mt-4 font-black uppercase text-xl">Waiting for input</p>
              </motion.div>
            ) : isAnalyzing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                 <Card className="animate-pulse">
                  <div className="h-4 bg-zinc-200 w-1/3 mb-4 border-2 border-black"></div>
                  <div className="space-y-3">
                    <div className="h-3 bg-zinc-200 border-2 border-black"></div>
                    <div className="h-3 bg-zinc-200 border-2 border-black w-5/6"></div>
                    <div className="h-3 bg-zinc-200 border-2 border-black w-4/6"></div>
                  </div>
                </Card>
                <Card className="animate-pulse bg-[#FFDE00]/10">
                  <div className="h-4 bg-zinc-200 w-1/4 mb-4 border-2 border-black"></div>
                  <div className="space-y-3">
                    <div className="h-3 bg-zinc-200 border-2 border-black"></div>
                    <div className="h-3 bg-zinc-200 border-2 border-black w-3/4"></div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-6"
              >
                <Card className="relative overflow-hidden p-0">
                  <div className="flex justify-between items-center p-4 border-b-4 border-black bg-[#FF6B6B]">
                    <h3 className="text-lg font-black uppercase text-white tracking-widest">Generated AI Prompt</h3>
                    <div className="flex gap-2">
                       <button 
                        onClick={async () => {
                          if (!result) return;
                          const tToast = toast.loading("Menerjemahkan...");
                          try {
                            const translated = await remixPrompt(result.prompt, "Indonesian language (keep the Midjourney format but translate descriptions)");
                            startTypingAnimation(translated || "");
                            toast.success("Diterjemahkan!", { id: tToast });
                          } catch (e) {
                            toast.error("Gagal terjemah", { id: tToast });
                          }
                        }} 
                        title="Translate to ID" 
                        className="p-1 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none translate-x-[2px] transition-all"
                      >
                        ID
                      </button>
                       <button onClick={copyToClipboard} title="Copy" className="p-1 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none translate-x-[2px] transition-all"><Copy size={18}/></button>
                       <button onClick={downloadTxt} title="Download" className="p-1 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none translate-x-[2px] transition-all"><Download size={18}/></button>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="bg-zinc-50 dark:bg-zinc-800 border-4 border-black p-4 font-mono text-sm whitespace-pre-wrap min-h-[300px]">
                      {displayText}
                      <motion.span 
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="inline-block w-2 h-4 bg-black dark:bg-white ml-1 align-middle"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <StatCard label="Subject" value={result.details.subject} />
                      <StatCard label="Style" value={result.details.style} />
                      <StatCard label="Lighting" value={result.details.lighting} />
                      <StatCard label="Camera" value={result.details.angle} />
                    </div>

                    <div className="p-3 bg-[#00E5FF] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <span className="font-black uppercase text-[10px]">Negative Prompt</span>
                      <p className="font-bold text-xs uppercase">Worst quality, low quality, blurry, ugly, distorted, deformed, watermark, bad anatomy, bad hands, extra limbs, unnatural skin, uncanny valley.</p>
                    </div>
                  </div>

                  <div className="p-4 border-t-4 border-black bg-white dark:bg-zinc-800 flex flex-wrap gap-2">
                    <p className="w-full text-[10px] font-black uppercase opacity-50 mb-1">AI Remix Flavors</p>
                    {["Gothic", "Cyberpunk", "Surreal", "Neon"].map(flavor => (
                      <button 
                        key={flavor}
                        disabled={isRemixing}
                        onClick={() => handleRemix(flavor)}
                        className="px-2 py-1 border-2 border-black bg-zinc-100 dark:bg-zinc-700 font-bold text-[10px] uppercase hover:bg-[#FF00F5] hover:text-white transition-all disabled:opacity-50"
                      >
                        {flavor}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 border-t-4 border-black bg-white dark:bg-zinc-800 flex gap-4">
                    <Button 
                      onClick={copyToClipboard}
                      className="flex-1 bg-black text-white shadow-[4px_4px_0px_0px_rgba(255,107,107,1)]"
                    >
                      COPY ALL
                    </Button>
                    <Button 
                      onClick={handleGenerate}
                      className="flex-1"
                      variant="primary"
                    >
                      REGENERATE
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <Card className="p-4 bg-white dark:bg-zinc-800">
      <p className="text-[10px] font-black uppercase text-zinc-400 mb-1">{label}</p>
      <p className="text-xs font-bold line-clamp-2 uppercase">{value}</p>
    </Card>
  );
}
