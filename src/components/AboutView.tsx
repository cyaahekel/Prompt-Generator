import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Zap, Sparkles, Image as ImageIcon, Copy, Download } from 'lucide-react';

export const AboutView = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black uppercase tracking-tighter">About Xyraa</h2>
        <p className="text-xl font-bold opacity-70">The ultimate bridge between vision and prompt.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-[#FFDE00]">
          <h3 className="text-2xl font-black uppercase mb-4 flex items-center gap-2">
            <Zap size={24} /> Our Mission
          </h3>
          <p className="font-bold leading-relaxed">
            Xyraa Prompt Generator was built to empower creators. We use state-of-the-art AI to translate your visual inspirations into professional, cinematic prompts for tools like Midjourney, Flux, and SDXL.
          </p>
        </Card>

        <Card className="bg-[#00E0FF]">
          <h3 className="text-2xl font-black uppercase mb-4 flex items-center gap-2">
            <Sparkles size={24} /> AI Powered
          </h3>
          <p className="font-bold leading-relaxed">
            Leveraging Google's Gemini Vision models, we analyze every pixel of your uploaded image to detect lighting, composition, style, and intricate details that human eyes might miss.
          </p>
        </Card>
      </div>

      <Card>
        <h3 className="text-2xl font-black uppercase mb-6">How it works</h3>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-black text-white w-10 h-10 flex items-center justify-center font-black shrink-0 border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,222,0,1)]">01</div>
            <div>
              <p className="font-black uppercase text-lg">Upload Your Image</p>
              <p className="font-bold opacity-70">Drop an image that captures the "vibe" or composition you want to replicate.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-black text-white w-10 h-10 flex items-center justify-center font-black shrink-0 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,224,255,1)]">02</div>
            <div>
              <p className="font-black uppercase text-lg">AI Analysis</p>
              <p className="font-bold opacity-70">Our system automatically dissects the image into cinematic categories.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-black text-white w-10 h-10 flex items-center justify-center font-black shrink-0 border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,0,245,1)]">03</div>
            <div>
              <p className="font-black uppercase text-lg">Refine & Use</p>
              <p className="font-bold opacity-70">Copy the professional prompt or download it as a TXT file for later use.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
