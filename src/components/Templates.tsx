import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Sparkles, Camera, User, Layers, Ghost } from 'lucide-react';

const templates = [
  {
    name: "Ultra-Realistic Portrait",
    icon: <User size={20} />,
    description: "Perfect for close-up faces with depth of field."
  },
  {
    name: "Cinematic Landscape",
    icon: <Layers size={20} />,
    description: "Wide angle shots with epic lighting and atmosphere."
  },
  {
    name: "Cyberpunk Aesthetic",
    icon: <Sparkles size={24} />,
    description: "Neon lights, rainy nights, and heavy stylization."
  },
  {
    name: "Macro Photography",
    icon: <Camera size={20} />,
    description: "Extreme close-ups with intense texture detail."
  }
];

export const Templates = () => {
  return (
    <div className="mt-12 space-y-6">
      <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
        <Ghost className="fill-black" /> PROMPT TEMPLATES
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((t, i) => (
          <Card key={i} className="bg-white dark:bg-zinc-800 hover:translate-y-[-4px] transition-transform cursor-pointer group">
            <div className="mb-4 p-3 bg-black text-white inline-block border-2 border-black group-hover:bg-[#FF00F5] transition-colors">
              {t.icon}
            </div>
            <h4 className="font-black uppercase text-sm mb-2">{t.name}</h4>
            <p className="text-xs font-bold opacity-60 leading-tight uppercase">{t.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
