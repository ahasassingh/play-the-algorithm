import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

interface NodePoint {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  alpha: number;
}

interface HeroAmbientCanvasProps {
  mouseX: number; // Normalized -1 to 1
  mouseY: number; // Normalized -1 to 1
}

export const HeroAmbientCanvas: React.FC<HeroAmbientCanvasProps> = ({ mouseX, mouseY }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize floating particles
    const particleCount = Math.min(Math.floor(width / 30), 40);
    const particles: Particle[] = [];
    const colors = ['#00F0FF', '#FF0055', '#FFE600', '#ffffff'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Network nodes
    const nodeCount = 12;
    const nodes: NodePoint[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        targetX: Math.random() * width,
        targetY: Math.random() * height,
        alpha: Math.random() * 0.2 + 0.05,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse offset
      const offsetX = mouseX * 25;
      const offsetY = mouseY * 25;

      // Draw faint circular ambient glow
      const cx = width / 2 + offsetX * 0.5;
      const cy = height / 2 + offsetY * 0.5;
      const gradient = ctx.createRadialGradient(cx, cy, 50, cx, cy, Math.max(width, height) * 0.5);
      gradient.addColorStop(0, 'rgba(0, 240, 255, 0.08)');
      gradient.addColorStop(0.5, 'rgba(13, 14, 21, 0.03)');
      gradient.addColorStop(1, 'rgba(7, 7, 11, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render & connect network lines
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += (node.targetX - node.x) * 0.005;
        node.y += (node.targetY - node.y) * 0.005;

        if (Math.hypot(node.targetX - node.x, node.targetY - node.y) < 10) {
          node.targetX = Math.random() * width;
          node.targetY = Math.random() * height;
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dist = Math.hypot(node.x - other.x, node.y - other.y);
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(node.x + offsetX * 0.2, node.y + offsetY * 0.2);
            ctx.lineTo(other.x + offsetX * 0.2, other.y + offsetY * 0.2);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * (1 - dist / 180)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Render particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const px = p.x + offsetX * (p.radius * 0.3);
        const py = p.y + offsetY * (p.radius * 0.3);

        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mouseX, mouseY]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
