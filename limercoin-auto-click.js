(() => {

    window.LIMER_STOP?.();

    const canvas = document.querySelector('canvas');

    if (!canvas) {
        console.log('❌ Canvas не найден');
        return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
        console.log('❌ 2D context не найден');
        return;
    }

    const original = ctx.drawImage;
    const targets = new Map();

    function clickCoin(gameX, gameY) {

        const rect = canvas.getBoundingClientRect();

        const screenX =
            rect.left +
            gameX * (rect.width / canvas.width);

        const screenY =
            rect.top +
            gameY * (rect.height / canvas.height);

        const key =
            Math.round(gameX / 5) + ':' +
            Math.round(gameY / 5);

        const now = Date.now();
        const last = targets.get(key) || 0;

        if (now - last < 300) {
            return;
        }

        targets.set(key, now);

        for (const [k, t] of targets) {
            if (now - t > 2000) {
                targets.delete(k);
            }
        }

        const down = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: screenX,
            clientY: screenY,
            screenX: screenX,
            screenY: screenY,
            button: 0,
            buttons: 1
        });

        const up = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: screenX,
            clientY: screenY,
            screenX: screenX,
            screenY: screenY,
            button: 0,
            buttons: 0
        });

        canvas.dispatchEvent(down);

        setTimeout(() => {
            canvas.dispatchEvent(up);
        }, 30);

        console.log(
            '🪙 CLICK',
            'Game:',
            Math.round(gameX),
            Math.round(gameY),
            'Screen:',
            Math.round(screenX),
            Math.round(screenY)
        );
    }

    ctx.drawImage = function (...a) {

        try {

            const img = a[0];

            // ТОЛЬКО МОНЕТЫ
            if (
                img?.width === 65 &&
                img?.height === 140
            ) {

                const t = ctx.getTransform();

                const gameX = t.e;
                const gameY = t.f;

                clickCoin(gameX, gameY);
            }

            // БОМБА 375x120 сюда НЕ попадёт

        } catch (e) {
            console.error('Limer ошибка:', e);
        }

        return original.apply(this, a);
    };

    window.LIMER_STOP = () => {

        ctx.drawImage = original;

        console.log('🛑 Limercoin бот остановлен');
    };

    console.log('================================');
    console.log('🪙 LIMERCOIN AUTO CLICK');
    console.log('================================');
    console.log('✅ Монеты: 65x140');
    console.log('🚫 Бомбы: 375x120 — игнорируются');
    console.log('🖱️ mousedown + mouseup');
    console.log('================================');

})();
