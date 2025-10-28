// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Intersection animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section, .card, .chip, .about__card').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// Reveal styles (injected for simplicity)
const style = document.createElement('style');
style.textContent = `
.reveal { opacity: 0; transform: translateY(14px); transition: opacity 700ms ease, transform 700ms ease; }
.reveal.in { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(style);

// Circuit background canvas
const canvas = document.getElementById('bg-circuit');
const ctx = canvas.getContext('2d');
let width, height, rafId;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const nodes = [];
const NODE_COUNT = Math.min(120, Math.floor((window.innerWidth * window.innerHeight) / 12000));
for (let i = 0; i < NODE_COUNT; i++) {
  nodes.push({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.2,
    vy: (Math.random() - 0.5) * 0.2,
  });
}

function step() {
  ctx.clearRect(0, 0, width, height);
  // glow background
  ctx.fillStyle = 'rgba(0, 10, 20, 0.6)';
  ctx.fillRect(0, 0, width, height);

  // draw connections
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 120 * 120) {
        const t = 1 - d2 / (120 * 120);
        const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        g.addColorStop(0, 'rgba(0,229,255,' + (0.05 + t * 0.35) + ')');
        g.addColorStop(1, 'rgba(0,255,133,' + (0.05 + t * 0.35) + ')');
        ctx.strokeStyle = g;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  // draw nodes
  for (const p of nodes) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;
    ctx.fillStyle = 'rgba(0,229,255,0.6)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }

  rafId = requestAnimationFrame(step);
}
step();

// Pause animation when tab not visible
document.addEventListener('visibilitychange', () => {
  if (document.hidden) cancelAnimationFrame(rafId);
  else step();
});

