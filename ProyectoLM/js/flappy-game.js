class JuegoJS {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return; // Guard clause
        this.ctx = this.canvas.getContext('2d');

        // Game State
        this.bird = { x: 50, y: 150, w: 20, h: 20, v: 0, g: 0.4, jump: -7 }; // Adjusted physics
        this.pipes = [];
        this.score = 0;
        this.gameActive = false; // Start inactive
        this.animationId = null;
        this.timer = 0;

        // Theme Colors
        this.colors = {
            bird: '#f7d54e', // Flappy Yellow
            pipe: '#76b400', // Flappy Green
            pipeBorder: '#558102',
            sky: '#71c5cf'
        };

        // Resize canvas to fit container
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Controls
        this.handleInput = this.handleInput.bind(this);
        this.canvas.addEventListener('click', this.handleInput);
        window.addEventListener('keydown', (e) => {
            if (e.code === "Space" && this.gameActive) {
                e.preventDefault(); // Prevent scrolling
                this.fly();
            }
        });

        // Initial Draw
        this.drawMessage("Click to Start");
    }

    resize() {
        const parent = this.canvas.parentElement;
        if (parent) {
            this.canvas.width = Math.min(600, parent.clientWidth - 40);
            this.canvas.height = 400;
        }
    }

    start() {
        if (this.gameActive) return;
        this.reset();
        this.gameActive = true;
        this.loop();
    }

    reset() {
        this.bird.y = 150;
        this.bird.v = 0;
        this.pipes = [];
        this.score = 0;
        this.timer = 0;
    }

    handleInput(e) {
        if (!this.gameActive) {
            this.start();
        } else {
            this.fly();
        }
    }

    fly() {
        this.bird.v = this.bird.jump;
    }

    update() {
        if (!this.gameActive) return;

        // Physics
        this.bird.v += this.bird.g;
        this.bird.y += this.bird.v;
        this.timer++;

        // Create Pipes
        if (this.timer % 120 === 0) { // Slower generation
            let gap = 130;
            let minPipe = 50;
            let maxPipe = this.canvas.height - gap - minPipe;
            let pipeTop = Math.random() * (maxPipe - minPipe) + minPipe;

            this.pipes.push({
                x: this.canvas.width,
                top: pipeTop,
                bottom: pipeTop + gap,
                passed: false
            });
        }

        // Move Pipes & Collision
        this.pipes.forEach((p, i) => {
            p.x -= 2.5; // Speed

            // Remove off-screen
            if (p.x + 50 < 0) {
                this.pipes.splice(i, 1);
            }

            // Score
            if (!p.passed && p.x + 50 < this.bird.x) {
                this.score++;
                p.passed = true;
            }

            // Collision Logic
            // 1. Pipe overlap X
            if (this.bird.x + this.bird.w > p.x && this.bird.x < p.x + 50) {
                // 2. Pipe overlap Y (Hit Top OR Hit Bottom)
                if (this.bird.y < p.top || this.bird.y + this.bird.h > p.bottom) {
                    this.gameOver();
                }
            }
        });

        // Ground/Ceiling Collision
        if (this.bird.y + this.bird.h > this.canvas.height || this.bird.y < 0) {
            this.gameOver();
        }
    }

    gameOver() {
        this.gameActive = false;
        cancelAnimationFrame(this.animationId);
        this.draw(); // Draw final state
        this.drawMessage(`Game Over! Score: ${this.score}\nClick to Restart`);
    }

    draw() {
        // Clear
        this.ctx.fillStyle = this.colors.sky;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Pipes
        this.ctx.fillStyle = this.colors.pipe;
        this.ctx.strokeStyle = this.colors.pipeBorder;
        this.ctx.lineWidth = 2;

        this.pipes.forEach(p => {
            // Top Pipe
            this.ctx.fillRect(p.x, 0, 50, p.top);
            this.ctx.strokeRect(p.x, 0, 50, p.top);

            // Bottom Pipe
            this.ctx.fillRect(p.x, p.bottom, 50, this.canvas.height - p.bottom);
            this.ctx.strokeRect(p.x, p.bottom, 50, this.canvas.height - p.bottom);
        });

        // Draw Bird
        this.ctx.fillStyle = this.colors.bird;
        this.ctx.fillRect(this.bird.x, this.bird.y, this.bird.w, this.bird.h);
        this.ctx.strokeStyle = '#000';
        this.ctx.strokeRect(this.bird.x, this.bird.y, this.bird.w, this.bird.h);

        // Draw Score
        if (this.gameActive) {
            this.ctx.fillStyle = "white";
            this.ctx.font = "20px 'Press Start 2P', cursive";
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 4;
            this.ctx.strokeText(`Score: ${this.score}`, 10, 40);
            this.ctx.fillText(`Score: ${this.score}`, 10, 40);
        }
    }

    drawMessage(text) {
        this.ctx.fillStyle = "rgba(0,0,0,0.5)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "white";
        this.ctx.font = "16px 'Press Start 2P', cursive";
        this.ctx.textAlign = "center";

        const lines = text.split('\n');
        let y = this.canvas.height / 2;

        lines.forEach((line, index) => {
            this.ctx.fillText(line, this.canvas.width / 2, y + (index * 30));
        });
        this.ctx.textAlign = "left"; // Reset
    }

    loop() {
        if (!this.gameActive) return;
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.loop());
    }
}
