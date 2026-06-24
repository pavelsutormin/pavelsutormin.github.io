const app = new PIXI.Application();

const BLOCK_SIZE = 40;
const GAME_SPEED = 10.386 * BLOCK_SIZE;
const GRAVITY = 94.0408163265 * BLOCK_SIZE;
const JUMP_FORCE = -20.3755102041 * BLOCK_SIZE; // Negative because PixiJS Y-axis goes DOWN
const MAX_FALL_VELOCITY = 35 * BLOCK_SIZE;      // High cap for terminal velocity
const FLOOR_Y = 12.5 * BLOCK_SIZE;

const SPIKE_HITBOX_WIDTH_SCALE = 0.35;
const SPIKE_HITBOX_HEIGHT_SCALE = 0.45;

const PLAYER_SPAWN = [4, 0];
let LEVEL = []

let player;
let obstacles = [];
let blocks = [];
let isGrounded = false;
let jumping = false;

async function getData() {
  try {
    const response = await fetch('StereoMadness.txt');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    LEVEL = await response.json();
    console.log(LEVEL);
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

function spawnObstacles() {
    for (var i = 0; i < LEVEL.length; i++) {
        const x = LEVEL[i][1] * BLOCK_SIZE;
        const y = LEVEL[i][2] * BLOCK_SIZE;
        if (LEVEL[i][0] == 0) {
            const obj = new PIXI.Graphics()
                .rect(0, -BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE)
                .stroke({ width: 5, color: 0xffffff })
                .fill(0x000000);
            obj.x = x;
            obj.y = FLOOR_Y - y;
            app.stage.addChild(obj);
            blocks.push(obj);
        } else if (LEVEL[i][0] == 1) {
            const obj = new PIXI.Graphics()
                .poly([
                    0, 0,
                    BLOCK_SIZE, 0,
                    BLOCK_SIZE / 2, -BLOCK_SIZE
                ])
                .stroke({ width: 5, color: 0xffffff })
                .fill(0x000000);
            obj.x = x;
            obj.y = FLOOR_Y - y;
            app.stage.addChild(obj);
            obstacles.push(obj);
        }
    }
}

async function init() {
    await app.init({ 
        width: 800,
        height: 600,
        resizeTo: window,
        resolution: window.devicePixelRatio || 1, 
        backgroundColor: 0x003366,
        antialias: true
    });
    document.body.appendChild(app.canvas);

    await getData();
    
    const floor = new PIXI.Graphics()
        .rect(0, FLOOR_Y, app.screen.width, 5)
        .fill(0xffffff);
    app.stage.addChild(floor);
    
    player = new PIXI.Graphics()
        .rect(-BLOCK_SIZE / 2, -BLOCK_SIZE / 2, BLOCK_SIZE, BLOCK_SIZE)
        .fill(0x00ffcc);
    player.x = PLAYER_SPAWN[0] * BLOCK_SIZE;
    player.y = FLOOR_Y - (BLOCK_SIZE / 2) - PLAYER_SPAWN[1] * BLOCK_SIZE;
    player.vy = 0;
    app.stage.addChild(player);

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') jumping = true;
    });
    document.addEventListener('keyup', (e) => {
        if (e.code === 'Space') jumping = false;
    });
    document.addEventListener('pointerdown', () => jumping = true);
    document.addEventListener('pointerup', () => jumping = false);
    spawnObstacles();
    app.ticker.add(update);
}

function handleJump() {
    if (isGrounded && jumping) {
        player.vy = JUMP_FORCE;
        isGrounded = false;
    }
}

function update(time) {
    const dt = time.deltaTime / 60;
    const playerHalfSize = BLOCK_SIZE / 2;
    
    // 1. Cache exact previous bottom BEFORE any movement happens
    const prevBottom = player.y + playerHalfSize;

    handleJump();
    
    // 2. Cache the velocity before gravity changes it
    const startVy = player.vy;
    
    // 3. Apply Gravity
    if (!isGrounded) {
        player.vy += GRAVITY * dt;
        if (player.vy > MAX_FALL_VELOCITY) {
            player.vy = MAX_FALL_VELOCITY;
        }
    }
    
    
    let landedThisFrame = false;

    // Calculate Hitbox boundaries
    const pBoxSize = BLOCK_SIZE;
    const pLeft = player.x - pBoxSize / 2;
    const pRight = player.x + pBoxSize / 2;
    const pTop = player.y - pBoxSize / 2;
    const pBottom = player.y + pBoxSize / 2;

    // 1. Basic Floor Collision Check
    if (player.y >= FLOOR_Y - playerHalfSize) {
        player.y = FLOOR_Y - playerHalfSize;
        player.vy = 0;
        landedThisFrame = true;
    }

    // 2. Update and Check Solid Blocks
    for (let i = blocks.length - 1; i >= 0; i--) {
        const block = blocks[i];
        block.x -= GAME_SPEED * dt;

        const bLeft = block.x;
        const bRight = block.x + BLOCK_SIZE;
        const bTop = block.y - BLOCK_SIZE;
        const bBottom = block.y;

        // Perform AABB check
        if (pRight > bLeft && pLeft < bRight && pBottom > bTop && pTop < bBottom) {
            
            // Use our pre-movement cached prevBottom and startVy
            if (startVy >= 0 && prevBottom <= bTop + 0.1) {
                player.y = bTop - playerHalfSize;
                player.vy = 0; 
                landedThisFrame = true;
            } else {
                resetGame();
                return;
            }
        }

        // Clean up off-screen blocks
        if (block.x < -BLOCK_SIZE) {
            app.stage.removeChild(block);
            blocks.splice(i, 1);
        }
    }

    // 3. Update and Check Spikes
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const spike = obstacles[i];
        spike.x -= GAME_SPEED * dt;

        const sWidth = BLOCK_SIZE * SPIKE_HITBOX_WIDTH_SCALE;
        const sHeight = BLOCK_SIZE * SPIKE_HITBOX_HEIGHT_SCALE;
        
        const sLeft = spike.x + (BLOCK_SIZE - sWidth) / 2;
        const sRight = sLeft + sWidth;
        const sTop = spike.y - sHeight;
        const sBottom = spike.y;

        if (pRight > sLeft && pLeft < sRight && pBottom > sTop && pTop < sBottom) {
            resetGame();
            return;
        }

        if (spike.x < -BLOCK_SIZE) {
            app.stage.removeChild(spike);
            obstacles.splice(i, 1);
        }
    }

    // 4. Handle Grounding State Transitions and Rotations
    if (landedThisFrame) {
        if (!isGrounded) {
            isGrounded = true;
            const currentRot = player.rotation;
            const targetRot = Math.round(currentRot / (Math.PI / 2)) * (Math.PI / 2);
            player.rotation = targetRot; 
        }
    } else {
        isGrounded = false;
        player.rotation += Math.PI * 2 * dt;
    }
}

function resetGame() {
    // Clear spikes from stage and memory
    obstacles.forEach(spike => app.stage.removeChild(spike));
    obstacles = [];

    // Clear blocks from stage and memory
    blocks.forEach(block => app.stage.removeChild(block));
    blocks = [];

    player.x = PLAYER_SPAWN[0] * BLOCK_SIZE;
    player.y = FLOOR_Y - (BLOCK_SIZE / 2) - PLAYER_SPAWN[1] * BLOCK_SIZE;
    player.vy = 0;
    player.rotation = 0;
    isGrounded = false;

    spawnObstacles();
}

init();