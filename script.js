const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// カメラストリームを開始する関数
async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
    });
    video.srcObject = stream;
    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve();
        };
    });
}

// COCO-SSDモデルを読み込んで物体検出を行う関数
async function detectObjects(model) {
    while (true) {
        const predictions = await model.detect(video);

        // 描画をクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 予測された物体を描画
        predictions.forEach(prediction => {
            const [x, y, width, height] = prediction.bbox;

            // バウンディングボックスを描画
            ctx.beginPath();
            ctx.rect(x, y, width, height);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'red';
            ctx.fillStyle = 'red';
            ctx.stroke();
            ctx.fillText(`${prediction.class} (${Math.round(prediction.score * 100)}%)`, x, y > 10 ? y - 5 : 10);
        });

        await tf.nextFrame();
    }
}

// 初期設定を行い、物体検出を開始する関数
async function main() {
    await setupCamera();
    const model = await cocoSsd.load();
    detectObjects(model);
}

main();
