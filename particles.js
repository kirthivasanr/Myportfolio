class ParticleBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.className = 'particle-bg';
        document.body.appendChild(this.canvas);
        
        this.particles = [];
        this.starTypes = [
            { size: 1, speed: 0.02, count: 100 },  // Distant stars
            { size: 2, speed: 0.05, count: 50 },   // Medium stars
            { size: 3, speed: 0.1, count: 20 }     // Bright stars
        ];
        
        this.init();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = document.documentElement.scrollHeight;
    }
    
    createParticles() {
        this.starTypes.forEach(type => {
            for (let i = 0; i < type.count; i++) {
                this.particles.push({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    size: type.size,
                    baseSize: type.size,
                    speed: type.speed,
                    direction: Math.random() * Math.PI * 2,
                    twinkleSpeed: Math.random() * 0.02 + 0.005,
                    twinkleTime: Math.random() * Math.PI * 2,
                    opacity: Math.random() * 0.5 + 0.5,
                    color: this.getStarColor()
                });
            }
        });
    }
    
    getStarColor() {
        const colors = [
            '255, 255, 255',     // Pure white
            '200, 200, 200',     // Light gray
            '150, 150, 150',     // Medium gray
            '100, 100, 100'      // Dark gray
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.particles.forEach(particle => {
            // Update position with subtle movement
            particle.x += Math.cos(particle.direction) * particle.speed;
            particle.y += Math.sin(particle.direction) * particle.speed;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.width;
            if (particle.x > this.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.height;
            if (particle.y > this.height) particle.y = 0;
            
            // Twinkling effect
            particle.twinkleTime += particle.twinkleSpeed;
            particle.size = particle.baseSize * (1 + Math.sin(particle.twinkleTime) * 0.3);
            particle.opacity = 0.5 + Math.sin(particle.twinkleTime) * 0.3;
            
            // Draw star
            this.ctx.beginPath();
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 2
            );
            gradient.addColorStop(0, `rgba(${particle.color}, ${particle.opacity})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add cross glare for bigger stars
            if (particle.baseSize > 1) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = `rgba(${particle.color}, ${particle.opacity * 0.5})`;
                this.ctx.lineWidth = 0.5;
                
                const glareSize = particle.size * 4;
                this.ctx.moveTo(particle.x - glareSize, particle.y);
                this.ctx.lineTo(particle.x + glareSize, particle.y);
                this.ctx.moveTo(particle.x, particle.y - glareSize);
                this.ctx.lineTo(particle.x, particle.y + glareSize);
                this.ctx.stroke();
            }
        });
    }
    
    animate() {
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParticleBackground();
});
