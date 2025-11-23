import React, { useRef, useEffect } from 'react';

interface WitchCauldronProps {
  onClick: () => void;
  disabled: boolean;
}

export const WitchCauldron: React.FC<WitchCauldronProps> = ({ onClick, disabled }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    let W = canvas.width = container.clientWidth;
    let H = canvas.height = container.clientHeight;
    
    const generatorStock: any[] = [];
    let animationFrameId: number;

    function randomInt(min: number, max: number) {
      return Math.floor(min + Math.random() * (max - min + 1));
    }

    function particle(this: any, vx: number, vy: number, size: number) {
      this.radius = randomInt(0, size);
      this.x = W / 2;
      this.y = H / 2; 
      this.alpha = 1;
      this.vx = randomInt(-vx, vx);
      if(Math.random() < 0.1){
        this.vy = randomInt(-vy, -vy-3);  
      }
      else{
        this.vy = randomInt(0, -vy);
      }
      this.lifetime = 100;
    }

    particle.prototype.update = function() {
      this.lifetime -= 2;
      this.x += this.vx;
      this.y += this.vy; 
      
      if (this.lifetime < 20){
        this.radius -= 2;
      }

      if (!context) return;
      context.beginPath();
      if (this.radius > 0) {
          context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
          context.fillStyle = "rgba(255,255,255,0.5)";
          context.strokeStyle = "#2f2";
          context.lineWidth = 10;
          context.fill();
          context.stroke();
      }
      context.closePath();
    }

    function particleGenerator(this: any, vx: number, vy: number, size: number, maxParticles: number) {
      this.size = size;
      this.vx = vx;
      this.vy = vy;
      this.maxParticles = maxParticles;
      this.particles = [];
    }

    var freq = 0.5;
    particleGenerator.prototype.animate = function() {
      if (this.particles.length < this.maxParticles && Math.random() < freq)  {
        this.particles.push(new (particle as any)(this.vx, this.vy, this.size));
        if(this.particles.length == this.maxParticles/2){
          freq = 0.1;
        }
      }
      for (var i = 0; i < this.particles.length; i++) {
        var p = this.particles[i];
        p.update();
        if (p.radius < 10) {
          this.particles[i] = new (particle as any)(this.vx, this.vy, this.size);
        }  
      }
    }

    generatorStock.push(new (particleGenerator as any)(2, 3, 30, 30));

    function update() {
      if (!context) return;
      context.clearRect(0, 0, W, H);

      for (var i = 0; i < generatorStock.length; i++) {
        generatorStock[i].animate();
      }
      animationFrameId = window.requestAnimationFrame(update);
    }                        

    update();

    const handleResize = () => {
        if (container && canvas) {
            W = canvas.width = container.clientWidth;
            H = canvas.height = container.clientHeight;
        }
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[400px] overflow-hidden rounded-xl group cursor-pointer select-none" onClick={!disabled ? onClick : undefined} style={{ backgroundColor: 'transparent' }}>
      
      {/* Canvas Layer (Gooeys) */}
      <div className="absolute inset-0 m-auto w-full h-full" style={{ filter: "url('#filter')" }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Glow */}
      <div className="absolute inset-0 m-auto w-0 h-0 rounded-full" 
           style={{ 
             top: '-100px', 
             color: 'rgba(68,255,68,0.4)',
             boxShadow: '0 0 150px 50px', 
             animation: 'witchCauldronGlow 0.5s linear infinite alternate' 
           }}>
      </div>

      {/* Shadow */}
      <div className="absolute inset-0 m-auto w-[220px] h-[20px] bg-[#111] rounded-[50%]"
           style={{ top: '210px' }}>
      </div>

      {/* Pot Top */}
      <div className="absolute inset-0 m-auto box-border w-[250px] h-[40px] bg-[#111] rounded-[20px_20px_80px_80px]"
           style={{ 
             top: '-50px', 
             boxShadow: '#4f4 0 10px 45px -17px inset' 
           }}>
      </div>

      {/* Pot Body */}
      <div className="absolute inset-0 m-auto box-border w-[250px] h-[120px] rounded-[25px_25px_80px_80px]"
           style={{ 
             top: '100px', 
             background: 'radial-gradient(#121, #111 45%)' 
           }}>
           
           {/* Clickable UI Overlay */}
           <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                <div className="text-4xl group-hover:scale-110 transition-transform">🎁</div>
                <div className="font-bold text-green-400 text-lg font-fantasy tracking-widest">TRICK OR TREAT</div>
                <div className={`text-xs font-mono bg-black/50 px-2 rounded mt-1 ${disabled ? 'text-gray-500' : 'text-orange-300'}`}>50 CANDY</div>
           </div>
      </div>

      {/* SVG Filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 17 -10" result="filter" />
            <feBlend/>
          </filter>
        </defs>
      </svg>

      <style>{`
        @keyframes witchCauldronGlow {
          to {
            box-shadow: 0 0 120px 50px;
          }
        }
      `}</style>
    </div>
  );
};