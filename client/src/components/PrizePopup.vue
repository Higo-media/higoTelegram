<template>
    <nut-popup
        v-model:visible="visible"
        position="center"
        :style="{ width: '85%', borderRadius: '20px', padding: '0' }"
        :close-on-click-overlay="false"
    >
        <div class="prize-popup">
            <canvas ref="canvasRef" class="confetti-canvas"></canvas>
            <div class="popup-close" @click="handleClose">
                <IconFont name="close" size="20" />
            </div>
            <div class="popup-stars">
                <div class="star star-1">✦</div>
                <div class="star star-2">✧</div>
                <div class="star star-3">✦</div>
                <div class="star star-4">✧</div>
                <div class="star star-5">✦</div>
                <div class="star star-6">✧</div>
            </div>
            <div class="popup-title">
                <span class="title-text">{{ t('popup.title') }}</span>
                <div class="title-underline"></div>
            </div>
            <div class="popup-content">
                <div class="prize-image-wrapper">
                    <div class="prize-glow"></div>
                    <div class="prize-sparkle"></div>
                    <img :src="prizeImg" alt="" class="prize-image" v-if="prizeImg">
                </div>
                <div class="prize-name">{{ prizeName }}</div>
            </div>
            <div class="popup-actions">
                <nut-button type="primary" block class="claim-btn" @click="handleClaim">
                    <span class="btn-text">{{ t('popup.claim') }}</span>
                    <span class="btn-shine"></span>
                </nut-button>
            </div>
        </div>
    </nut-popup>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface Props {
    modelValue: boolean;
    prizeName?: string;
    prizeImg?: string;
    adLink?: string;
}

interface Emits {
    (e: 'update:modelValue', value: boolean): void;
    (e: 'claim'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const visible = ref(props.modelValue);
const canvasRef = ref<HTMLCanvasElement | null>(null);
let animationId: number | null = null;

// 粒子系统
class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
    rotation: number;
    rotationSpeed: number;
    life: number;
    decay: number;

    constructor(canvas: HTMLCanvasElement) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.color = this.randomColor();
        this.size = Math.random() * 10 + 5;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }

    randomColor() {
        const colors = [
            '#FF5252', '#FF1744', '#D50000', '#F44336',
            '#E57373', '#EF9A9A', '#FFCDD2', '#FF8A80',
            '#FF6E40', '#FF5722', '#FFAB91', '#FFEBEE'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.15; // 重力
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.rotation += this.rotationSpeed;
        this.life -= this.decay;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;

        // 绘制星星形状
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const x = Math.cos(angle) * this.size;
            const y = Math.sin(angle) * this.size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

class Confetti {
    particles: Particle[] = [];
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.resize();
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    explode() {
        for (let i = 0; i < 60; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles = this.particles.filter(p => p.life > 0);
        this.particles.forEach(p => {
            p.update();
            p.draw(this.ctx);
        });

        if (this.particles.length > 0) {
            animationId = requestAnimationFrame(() => this.animate());
        }
    }

    destroy() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }
}

let confetti: Confetti | null = null;

const startConfetti = () => {
    if (!canvasRef.value) return;
    if (!confetti) {
        confetti = new Confetti(canvasRef.value);
    }
    confetti.explode();
    confetti.animate();
};

const stopConfetti = () => {
    if (confetti) {
        confetti.destroy();
    }
};

watch(() => props.modelValue, (val) => {
    visible.value = val;
    if (val) {
        setTimeout(startConfetti, 300);
    } else {
        stopConfetti();
    }
});

watch(visible, (val) => {
    emit('update:modelValue', val);
});

const handleClose = () => {
    visible.value = false;
};

const handleClaim = () => {
    if (props.adLink) {
        window.open(props.adLink, '_blank');
    }
    emit('claim');
    visible.value = false;
};

onUnmounted(() => {
    stopConfetti();
});
</script>

<style scoped lang="scss">
.prize-popup {
    padding: 30px 20px;
    text-align: center;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #d32f2f 0%, #e53935 30%, #f44336 60%, #ff5252 100%);
    animation: popupPop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes popupPop {
    0% {
        transform: scale(0.5);
        opacity: 0;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.confetti-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
}

.popup-close {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    z-index: 10;
    transition: all 0.3s ease;

    &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: rotate(90deg);
    }
}

.popup-stars {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 2;
}

.star {
    position: absolute;
    font-size: 24px;
    color: #FFEB3B;
    animation: starTwinkle 1.5s ease-in-out infinite;
    text-shadow: 0 0 10px #FFC107, 0 0 20px #FF9800;

    &.star-1 {
        top: 30px;
        left: 20px;
        animation-delay: 0s;
    }

    &.star-2 {
        top: 20px;
        right: 80px;
        animation-delay: 0.3s;
        font-size: 18px;
    }

    &.star-3 {
        bottom: 120px;
        left: 30px;
        animation-delay: 0.6s;
        font-size: 20px;
    }

    &.star-4 {
        bottom: 140px;
        right: 25px;
        animation-delay: 0.9s;
    }

    &.star-5 {
        top: 80px;
        left: 15px;
        animation-delay: 1.2s;
        font-size: 16px;
    }

    &.star-6 {
        top: 70px;
        right: 20px;
        animation-delay: 0.15s;
        font-size: 14px;
    }
}

@keyframes starTwinkle {
    0%, 100% {
        opacity: 0.3;
        transform: scale(0.8);
    }
    50% {
        opacity: 1;
        transform: scale(1.2);
    }
}

.popup-title {
    position: relative;
    z-index: 3;
    margin-bottom: 25px;

    .title-text {
        display: inline-block;
        font-size: 26px;
        font-weight: bold;
        color: #fff;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3),
                     0 0 20px rgba(255, 110, 64, 0.5);
        animation: titleBounce 0.6s ease-out 0.3s both;
    }

    .title-underline {
        width: 60px;
        height: 3px;
        background: linear-gradient(90deg, transparent, #FFAB91, transparent);
        margin: 10px auto 0;
        animation: underlineGlow 2s ease-in-out infinite;
    }
}

@keyframes titleBounce {
    0% {
        transform: translateY(-20px);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes underlineGlow {
    0%, 100% {
        opacity: 0.5;
        transform: scaleX(0.5);
    }
    50% {
        opacity: 1;
        transform: scaleX(1);
    }
}

.popup-content {
    position: relative;
    z-index: 3;
    margin-bottom: 30px;
}

.prize-image-wrapper {
    position: relative;
    width: 140px;
    height: 140px;
    margin: 0 auto 20px;
}

.prize-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(255, 110, 64, 0.4) 0%, transparent 70%);
    border-radius: 50%;
    animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {
    0%, 100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.5;
    }
    50% {
        transform: translate(-50%, -50%) scale(1.3);
        opacity: 1;
    }
}

.prize-sparkle {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    animation: sparkleRotate 3s linear infinite;
}

.prize-sparkle::before,
.prize-sparkle::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: #FFAB91;
    border-radius: 50%;
    box-shadow: 0 0 15px #FF8A80, 0 0 30px #FF5722;
}

.prize-sparkle::before {
    top: 10px;
    left: 50%;
    animation: sparkleFade 1.5s ease-in-out infinite;
}

.prize-sparkle::after {
    bottom: 20px;
    right: 15px;
    animation: sparkleFade 1.5s ease-in-out infinite 0.75s;
}

@keyframes sparkleRotate {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

@keyframes sparkleFade {
    0%, 100% {
        opacity: 0.2;
        transform: scale(0.8);
    }
    50% {
        opacity: 1;
        transform: scale(1.2);
    }
}

.prize-image {
    position: relative;
    z-index: 2;
    width: 100px;
    height: 100px;
    object-fit: contain;
    animation: prizeFloat 3s ease-in-out infinite, prizeAppear 0.5s ease-out 0.4s both;
    filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3));
}

@keyframes prizeFloat {
    0%, 100% {
        transform: translateY(0) rotate(0deg);
    }
    50% {
        transform: translateY(-10px) rotate(5deg);
    }
}

@keyframes prizeAppear {
    0% {
        transform: scale(0) rotate(-180deg);
        opacity: 0;
    }
    100% {
        transform: scale(1) rotate(0deg);
        opacity: 1;
    }
}

.prize-name {
    font-size: 22px;
    color: #fff;
    font-weight: 600;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    animation: prizeNameSlide 0.5s ease-out 0.6s both;
}

@keyframes prizeNameSlide {
    0% {
        transform: translateY(20px);
        opacity: 0;
    }
    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

.popup-actions {
    position: relative;
    z-index: 3;
}

.claim-btn {
    height: 50px !important;
    border-radius: 25px !important;
    font-size: 18px !important;
    font-weight: bold !important;
    background: linear-gradient(135deg, #fff8e1 0%, #ffcc80 30%, #ffb74d 70%, #ff9800 100%) !important;
    border: none !important;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
    animation: btnPop 0.5s ease-out 0.7s both;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    :deep(.nut-button__text) {
        color: #d32f2f;
    }

    &:active {
        transform: scale(0.95);
        box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3) !important;
    }

    :deep(.nut-button__text) {
        position: relative;
        z-index: 2;
    }
}

@keyframes btnPop {
    0% {
        transform: scale(0.8);
        opacity: 0;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.btn-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
    );
    animation: btnShine 2s ease-in-out infinite;
}

@keyframes btnShine {
    0% {
        left: -100%;
    }
    50%, 100% {
        left: 100%;
    }
}
</style>
