const canvas = document.createElement("canvas");
document.body.style.margin = 0;
document.body.style.background = "#a2dfff";
canvas.style.display = "block";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Bubble {
  constructor() {
    this.radius = Math.random() * 20 + 10;
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + this.radius;
    this.speed = Math.random() * 2 + 1;
    this.color = `rgba(255, 255, 255, ${Math.random() * 0.4 + 0.2})`;
    this.exploded = false;
  }

  update() {
    this.y -= this.speed;
    if (this.y < canvas.height * 0.3 && !this.exploded) {
      this.exploded = true;
      createParticles(this.x, this.y);
    }
  }

  draw() {
    if (!this.exploded) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  isClicked(mx, my) {
    const dx = this.x - mx;
    const dy = this.y - my;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 3 + 2;
    this.speedX = (Math.random() - 0.5) * 4;
    this.speedY = (Math.random() - 0.5) * 4;
    this.alpha = 1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= 0.02;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.fill();
  }
}

const bubbles = [];
const particles = [];

function createBubble() {
  if (bubbles.length < 50) {
    bubbles.push(new Bubble());
  }
}

function createParticles(x, y) {
  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(x, y));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = bubbles.length - 1; i >= 0; i--) {
    const bubble = bubbles[i];
    bubble.update();
    bubble.draw();
    if (bubble.exploded || bubble.y + bubble.radius < 0) {
      bubbles.splice(i, 1);
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw();
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  for (let i = bubbles.length - 1; i >= 0; i--) {
    if (bubbles[i].isClicked(mx, my)) {
      createParticles(bubbles[i].x, bubbles[i].y);
      bubbles.splice(i, 1);
      break;
    }
  }
});

setInterval(createBubble, 200);
animate();