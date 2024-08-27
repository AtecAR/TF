const fileInput = document.getElementById('file-input');
const image = document.getElementById('image');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 画像が読み込まれたときの処理
fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        image.src = url;
        image.onload = async () => {
            // 画像のサイズをキャンバスに合わせる
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            
            // COCO-SSDモデルの読み込み
            const model = await cocoSsd.load();
            
            // 物体検出
            const predictions = await model.detect(canvas);

            // バウンディングボックスの描画
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

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
        };
    }
});
