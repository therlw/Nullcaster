import React, { useEffect, useState } from 'react';
import { Hammer, Zap } from 'lucide-react';

interface ForgeOverlayProps {
    isForging: boolean;
}

export const ForgeOverlay: React.FC<ForgeOverlayProps> = ({ isForging }) => {
    const [hits, setHits] = useState(0);
    const [sparks, setSparks] = useState<{id: number, tx: string, ty: string}[]>([]);

    useEffect(() => {
        if (isForging) {
            setHits(0);
            setSparks([]);
            
            // Sequence of hits
            const timers = [
                setTimeout(() => triggerHit(1), 500),
                setTimeout(() => triggerHit(2), 1500),
                setTimeout(() => triggerHit(3), 2500),
            ];
            return () => timers.forEach(clearTimeout);
        }
    }, [isForging]);

    const triggerHit = (count: number) => {
        setHits(count);
        
        // Generate sparks
        const newSparks = Array.from({ length: 12 }).map((_, i) => ({
            id: Date.now() + i,
            tx: `${(Math.random() - 0.5) * 400}px`,
            ty: `${-50 - Math.random() * 200}px`
        }));
        setSparks(newSparks);
    };

    if (!isForging) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center overflow-hidden">
            {/* Background heat glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 via-orange-900/20 to-transparent animate-pulse"></div>

            {/* Sparks Container */}
            {sparks.map(s => (
                <div 
                    key={s.id}
                    className="absolute left-1/2 top-1/2 w-2 h-2 bg-yellow-300 rounded-full animate-spark-fly"
                    style={{ '--tx': s.tx, '--ty': s.ty } as React.CSSProperties}
                />
            ))}

            {/* Main Assembly */}
            <div className="relative flex flex-col items-center">
                {/* The Hammer */}
                <div className={`transform transition-transform origin-bottom-right mb-4 ${hits > 0 ? 'animate-hammer-hit' : ''}`}>
                    <Hammer size={120} className="text-slate-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" fill="#475569" />
                </div>

                {/* The Anvil Zone */}
                <div className={`relative p-12 bg-slate-800 rounded-full border-4 border-red-900/50 shadow-[0_0_50px_rgba(220,38,38,0.5)] ${hits > 0 ? 'animate-shake-hard' : ''}`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                         {/* Molten Core */}
                        <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full blur-md animate-pulse"></div>
                    </div>
                    <Zap size={64} className={`relative z-10 text-yellow-200 ${hits > 0 ? 'scale-110 opacity-100' : 'scale-100 opacity-50'} transition-all duration-100`} />
                </div>

                {/* Impact Text */}
                {hits > 0 && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-fantasy font-bold text-yellow-500 animate-slam pointer-events-none drop-shadow-lg border-text">
                        CLANG!
                    </div>
                )}

                <div className="mt-12 text-orange-400 font-mono text-lg tracking-[0.5em] animate-pulse">
                    FORGING ARTIFACT...
                </div>
            </div>
        </div>
    );
};