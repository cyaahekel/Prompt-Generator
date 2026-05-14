import { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Copy, Trash2, Calendar, Eye, Download, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';

export const HistoryView = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('prompt_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const deleteItem = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('prompt_history', JSON.stringify(updated));
    if (selectedItem?.id === id) setSelectedItem(null);
    toast.success("Item removed from history");
  };

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Prompt copied!");
  };

  const downloadHistory = () => {
    const data = JSON.stringify(history, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `xyraa-history-${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">Your Archives</h2>
          <p className="font-bold opacity-70 uppercase text-xs tracking-widest mt-1">Stored locally on your neural link</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={downloadHistory}
            className="flex items-center gap-2 px-4 py-2 border-4 border-black font-bold uppercase bg-[#FFDE00] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all"
          >
            <Download size={18}/> Export Archive
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-20 border-dashed opacity-40">
          <ImageIcon size={80} />
          <p className="mt-4 font-black uppercase text-xl">Archive is empty</p>
          <p className="font-bold">Generate a prompt to start your collection.</p>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* History List */}
          <div className="lg:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {history.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedItem(item)}
                className={`cursor-pointer group relative ${selectedItem?.id === item.id ? 'z-10' : ''}`}
              >
                <Card className={`p-4 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800 ${selectedItem?.id === item.id ? 'border-[#FF00F5] bg-zinc-50 dark:bg-zinc-800 translate-x-2' : ''}`}>
                  <div className="flex gap-4">
                    <div className="w-16 h-16 border-2 border-black flex-shrink-0 overflow-hidden bg-black">
                      <img src={item.imageUrl} alt="Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <Badge className="mb-2 scale-75 origin-left">PROMPT #{item.id.slice(-4)}</Badge>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-[10px] font-bold font-mono opacity-50 flex items-center gap-1">
                        <Calendar size={10} /> {new Date(item.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-xs font-bold line-clamp-1 uppercase mt-1">{item.details.subject}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedItem ? (
                <motion.div
                  key={selectedItem.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="h-full flex flex-col gap-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-black uppercase tracking-tighter">Archive Details</h3>
                      <div className="flex gap-2">
                        <button onClick={() => copyPrompt(selectedItem.prompt)} className="p-2 border-4 border-black bg-[#FFDE00] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none translate-x-[3px] transition-all">
                          <Copy size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                       <div className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-black aspect-video overflow-hidden">
                          <img src={selectedItem.imageUrl} alt="Full" className="w-full h-full object-contain" />
                       </div>
                       <div className="space-y-4">
                          <DetailRow label="Subject" value={selectedItem.details.subject} />
                          <DetailRow label="Style" value={selectedItem.details.style} />
                          <DetailRow label="Lighting" value={selectedItem.details.lighting} />
                          <DetailRow label="Environment" value={selectedItem.details.environment} />
                       </div>
                    </div>

                    <div className="flex-1">
                      <p className="text-xs font-black uppercase mb-2 opacity-50">Master Prompt</p>
                      <div className="bg-zinc-900 border-4 border-black p-4 text-white font-mono text-xs whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                        {selectedItem.prompt}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-20 border-4 border-black border-dashed opacity-20">
                   <Eye size={100} />
                   <p className="mt-4 font-black uppercase text-xl">Select an archive</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase text-zinc-400 mb-0.5">{label}</p>
      <p className="text-xs font-bold uppercase line-clamp-2">{value}</p>
    </div>
  );
}
