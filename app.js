// ==========================================
// 中国国旗渐变头像生成器
// app.js
// ==========================================


// ==========================================
// 获取页面元素
// ==========================================

const imageInput =
    document.getElementById("imageInput");

const canvas =
    document.getElementById("canvas");

const ctx =
    canvas.getContext("2d");

const emptyText =
    document.getElementById("emptyText");


const redStrength =
    document.getElementById("redStrength");

const gradientSize =
    document.getElementById("gradientSize");

const starOpacity =
    document.getElementById("starOpacity");

const starScale =
    document.getElementById("starScale");

const starSpacing =
    document.getElementById("starSpacing");


const downloadButton =
    document.getElementById("downloadButton");


// ==========================================
// 保存用户上传的原图
// ==========================================

let originalImage = null;


// ==========================================
// 上传图片
// ==========================================

imageInput.addEventListener(
    "change",

    function (event) {

        const file =
            event.target.files[0];


        if (!file) {
            return;
        }


        if (!file.type.startsWith("image/")) {

            alert(
                "请选择 JPG、PNG 或 WebP 图片"
            );

            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function (e) {

                const img =
                    new Image();


                img.onload =
                    function () {

                        originalImage =
                            img;


                        canvas.width =
                            img.naturalWidth;

                        canvas.height =
                            img.naturalHeight;


                        renderCanvas();


                        canvas.style.display =
                            "block";

                        emptyText.style.display =
                            "none";
                    };


                img.src =
                    e.target.result;
            };


        reader.readAsDataURL(file);
    }
);


// ==========================================
// 所有滑块实时更新
// ==========================================

redStrength.addEventListener(
    "input",
    renderCanvas
);


gradientSize.addEventListener(
    "input",
    renderCanvas
);


starOpacity.addEventListener(
    "input",
    renderCanvas
);


starScale.addEventListener(
    "input",
    renderCanvas
);


starSpacing.addEventListener(
    "input",
    renderCanvas
);


// ==========================================
// 总绘制函数
// ==========================================

function renderCanvas() {

    if (!originalImage) {
        return;
    }


    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // 1. 绘制原图
    ctx.drawImage(
        originalImage,
        0,
        0,
        canvas.width,
        canvas.height
    );


    // 2. 绘制红色渐变
    drawRedGradient();


    // 3. 绘制五星
    drawFlagStars();
}


// ==========================================
// 左上角红色渐变
// ==========================================

function drawRedGradient() {

    const w =
        canvas.width;

    const h =
        canvas.height;


    const strength =
        Number(
            redStrength.value
        ) / 100;


    const size =
        Number(
            gradientSize.value
        ) / 100;


    const diagonal =
        Math.sqrt(
            w * w +
            h * h
        );


    const radius =
        diagonal *
        size *
        0.78;


    const gradient =
        ctx.createRadialGradient(
            0,
            0,
            0,

            0,
            0,
            radius
        );


    gradient.addColorStop(
        0,
        `rgba(220, 0, 0, ${0.92 * strength})`
    );


    gradient.addColorStop(
        0.18,
        `rgba(220, 0, 0, ${0.78 * strength})`
    );


    gradient.addColorStop(
        0.38,
        `rgba(220, 0, 0, ${0.52 * strength})`
    );


    gradient.addColorStop(
        0.58,
        `rgba(220, 0, 0, ${0.28 * strength})`
    );


    gradient.addColorStop(
        0.78,
        `rgba(220, 0, 0, ${0.10 * strength})`
    );


    gradient.addColorStop(
        1,
        `rgba(220, 0, 0, 0)`
    );


    ctx.save();

    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        w,
        h
    );

    ctx.restore();
}


// ==========================================
// 绘制中国国旗五星
// ==========================================

function drawFlagStars() {

    const w =
        canvas.width;

    const h =
        canvas.height;


    const opacity =
        Number(
            starOpacity.value
        ) / 100;


    const scale =
        Number(
            starScale.value
        ) / 100;


    const spacing =
        Number(
            starSpacing.value
        ) / 100;


    const unit =
        Math.min(
            w,
            h
        );


    // 大星基准位置

    const baseX =
        unit * 0.14;

    const baseY =
        unit * 0.16;


    // 星星尺寸

    const bigRadius =
        unit *
        0.060 *
        scale;


    const smallRadius =
        unit *
        0.022 *
        scale;


    // 大星

    const bigStar = {

        x:
            baseX,

        y:
            baseY,

        r:
            bigRadius
    };


    // 四颗小星

    const smallStars = [

        {
            x:
                baseX +
                unit *
                0.12 *
                spacing,

            y:
                baseY -
                unit *
                0.08 *
                spacing,

            r:
                smallRadius
        },


        {
            x:
                baseX +
                unit *
                0.18 *
                spacing,

            y:
                baseY -
                unit *
                0.01 *
                spacing,

            r:
                smallRadius
        },


        {
            x:
                baseX +
                unit *
                0.18 *
                spacing,

            y:
                baseY +
                unit *
                0.09 *
                spacing,

            r:
                smallRadius
        },


        {
            x:
                baseX +
                unit *
                0.12 *
                spacing,

            y:
                baseY +
                unit *
                0.17 *
                spacing,

            r:
                smallRadius
        }
    ];


    ctx.save();


    ctx.fillStyle =
        `rgba(255, 222, 0, ${opacity})`;


    // 大星

    drawStar(
        bigStar.x,
        bigStar.y,
        bigStar.r,
        bigStar.r * 0.382,
        -Math.PI / 2
    );


    // 四颗小星

    smallStars.forEach(

        function (star) {

            const angle =
                Math.atan2(
                    bigStar.y - star.y,
                    bigStar.x - star.x
                );


            drawStar(
                star.x,
                star.y,
                star.r,
                star.r * 0.382,
                angle
            );
        }
    );


    ctx.restore();
}


// ==========================================
// 绘制五角星
// ==========================================

function drawStar(
    centerX,
    centerY,
    outerRadius,
    innerRadius,
    rotation
) {

    ctx.beginPath();


    for (
        let i = 0;
        i < 10;
        i++
    ) {

        const angle =
            rotation +
            i *
            Math.PI /
            5;


        const radius =
            i % 2 === 0
                ? outerRadius
                : innerRadius;


        const x =
            centerX +
            Math.cos(angle) *
            radius;


        const y =
            centerY +
            Math.sin(angle) *
            radius;


        if (i === 0) {

            ctx.moveTo(
                x,
                y
            );

        } else {

            ctx.lineTo(
                x,
                y
            );
        }
    }


    ctx.closePath();

    ctx.fill();
}


// ==========================================
// 下载处理后的图片
// ==========================================

downloadButton.addEventListener(

    "click",

    function () {


        if (!originalImage) {

            alert(
                "请先上传一张图片"
            );

            return;
        }


        canvas.toBlob(

            function (blob) {


                const url =
                    URL.createObjectURL(
                        blob
                    );


                const link =
                    document.createElement(
                        "a"
                    );


                link.href =
                    url;


                link.download =
                    "china-flag-gradient-avatar.png";


                document.body.appendChild(
                    link
                );


                link.click();


                document.body.removeChild(
                    link
                );


                URL.revokeObjectURL(
                    url
                );
            },


            "image/png"
        );
    }
);