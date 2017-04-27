var vm_color = new Vue({
    el: '#container',
    data: {
        colors: []

    },
    created: function () {
        //初始加载
        this.pageInit();
    },
    computed: {
    },
    methods: {
        pageInit: function () {
            pageLoad(vm_color);

        }
    },
    components: {
    }
});

function pageLoad(vm) {
    // Production steps of ECMA-262, Edition 5, 15.4.4.18
    // Reference: http://es5.github.com/#x15.4.4.18
    if (!Array.prototype.forEach) {

        Array.prototype.forEach = function forEach(callback, thisArg) {

            var T, k;

            if (this == null) {
                throw new TypeError("this is null or not defined");
            }

            // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
            var O = Object(this);

            // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
            // 3. Let len be ToUint32(lenValue).
            var len = O.length >>> 0; // Hack to convert O.length to a UInt32

            // 4. If IsCallable(callback) is false, throw a TypeError exception.
            // See: http://es5.github.com/#x9.11
            if ({}.toString.call(callback) !== "[object Function]") {
                throw new TypeError(callback + " is not a function");
            }

            // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
            if (thisArg) {
                T = thisArg;
            }

            // 6. Let k be 0
            k = 0;

            // 7. Repeat, while k < len
            while (k < len) {

                var kValue;

                // a. Let Pk be ToString(k).
                //   This is implicit for LHS operands of the in operator
                // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
                //   This step can be combined with c
                // c. If kPresent is true, then
                if (Object.prototype.hasOwnProperty.call(O, k)) {

                    // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                    kValue = O[k];

                    // ii. Call the Call internal method of callback with T as the this value and
                    // argument list containing kValue, k, and O.
                    callback.call(T, kValue, k, O);
                }
                // d. Increase k by 1.
                k++;
            }
            // 8. return undefined
        };
    }

    if (!Array.prototype.filter) {
        Array.prototype.filter = function (fun /*, thisArg */) {
            "use strict";

            if (this === void 0 || this === null)
                throw new TypeError();

            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== "function")
                throw new TypeError();

            var res = [];
            var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
            for (var i = 0; i < len; i++) {
                if (i in t) {
                    var val = t[i];

                    // NOTE: Technically this should Object.defineProperty at
                    //       the next index, as push can be affected by
                    //       properties on Object.prototype and Array.prototype.
                    //       But that method's new, and collisions should be
                    //       rare, so use the more-compatible alternative.
                    if (fun.call(thisArg, val, i, t))
                        res.push(val);
                }
            }

            return res;
        };
    }

    var colorsArray;

    var invertFontColor = function (isBlack) {
        var nodes = document.querySelectorAll('#colors li a .name, #colors li a .pinyin');
        if (isBlack === true) {
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].style.color = '#333';
            }
        } else
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].removeAttribute(style);
            }
    }

    var renderColor = function (color) {

        var colorHex = color.hex,
            rgb = color.RGB,
            cmyk = color.CMYK,
            name = color.name,
            pinyin = color.pinyin.toUpperCase();


        document.getElementById('wrapper').style.backgroundColor = colorHex;
        document.getElementById('pinyin').innerHTML = pinyin;
        document.querySelector('#RGBvalue input').value = colorHex;


        document.getElementById('name').style.backgroundImage = 'url(img/name/' + pinyin.toLowerCase() + '.png)';
        document.getElementById('name').style.height = (name.length * 80).toString() + 'px';


        if (history && history.pushState) {
            var state = {
                title: name,
                url: '#' + pinyin.toLowerCase()
            };
            document.title = name + ' - 中国色 - 中国传统颜色';
            history.pushState(state, "中国色 - " + name, "#" + pinyin.toLowerCase());
        }

        for (var i in rgb) {
            var el = document.querySelector('#RGBcolor dd.' + 'rgb'[i] + ' span');
            el.innerHTML = rgb[i];
        }

        for (var i in cmyk) {
            var n = 'cmyk'[i],
                v = cmyk[i];
            document.querySelector('#CMYKcolor dd.' + n + ' .cont').innerHTML = v;
            if (v < 50) {
                document.querySelector('#CMYKcolor dd.' + n + ' .l .line').style.transform = 'rotate(180deg)';
                document.querySelector('#CMYKcolor dd.' + n + ' .r .line').style.transform = 'rotate(' + (v * 360 / 100).toString() +
                    'deg)';
            } else {
                document.querySelector('#CMYKcolor dd.' + n + ' .l .line').style.transform = 'rotate(' + (v * 360 / 100).toString() +
                    'deg)';
                document.querySelector('#CMYKcolor dd.' + n + ' .r .line').style.transform = 'rotate(180deg)';
            }
        }
    };

    var hashRenderColor = function () {
        if (location.hash != '') {
            var colorPinyin = location.hash.substring(1),
                hashColor = colorsArray.filter(function (color) {
                    return color.pinyin === colorPinyin;
                })[0];
            renderColor(hashColor);
        }
    };

    var drawArcAndLine = function (cmyk, rgb) {
        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d'),
            lineHeight = 278 - 150;

        canvas.width = 50;
        canvas.height = 278;
        cmyk.forEach(function (v, i) {
            var ctx = canvas.getContext('2d'),
                endAngle = (-90 + (360 * v / 100)) * (Math.PI / 180);

            if (v == 0) endAngle = 1.5 * Math.PI;
            ctx.beginPath();
            ctx.arc(14, 31.3 * (i + 1), 9, 1.5 * Math.PI, endAngle);
            ctx.lineWidth = 6;
            context.strokeStyle = 'white';
            ctx.stroke();
        });
        context.lineWidth = 1;
        context.moveTo(18, 150);
        context.lineTo(18, 150 + lineHeight * (rgb[0] / 255))
        context.moveTo(21, 150);
        context.lineTo(21, 150 + lineHeight * (rgb[1] / 255))
        context.moveTo(24, 150);
        context.lineTo(24, 150 + lineHeight * (rgb[2] / 255))
        context.stroke();
        return canvas;
    };

    var rgb2hsv = function (rgb) {
        var r = rgb[0] / 255,
            g = rgb[1] / 255,
            b = rgb[2] / 255;
        var max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
            h = 0;
        } else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return [h, s, v];
    }

    var handleColors = function (data) {
        colorsArray = JSON.parse(data);

        colorsArray.sort(function (a, b) {
            if (rgb2hsv(a.RGB)[0] === rgb2hsv(b.RGB)[0])
                return rgb2hsv(b.RGB)[1] - rgb2hsv(a.RGB)[1];
            else
                return rgb2hsv(b.RGB)[0] - rgb2hsv(a.RGB)[0];
        });

        colorsArray.forEach(function (color, i) {
            var colorLI = document.createElement('li'),
                colorDIV = document.createElement('div'),
                colorA = document.createElement('a');

            // Style
            colorLI.style.top = Math.floor(i / 7) * 300 + 'px';
            colorLI.style.left = (i - (Math.floor(i / 7) * 7)) * 65 + 'px';
            colorLI.style.borderTop = '6px solid ' + color.hex;

            colorA.innerHTML = '<span class="name" style="color: ' + color.hex + '">' + color.name +
                '</span><span class="pinyin">' + color.pinyin + '</span><span class="rgb">' + color.hex.replace('#', '') +
                '</span>';
            colorA.appendChild(drawArcAndLine(color.CMYK, color.RGB));
            colorDIV.appendChild(colorA);
            colorLI.appendChild(colorDIV);

            colorLI.addEventListener('click', function (e) {
                renderColor(color);
            });
            document.getElementById('colors').appendChild(colorLI);
        });
        hashRenderColor();
    };


    var r = new XMLHttpRequest();
    r.open('GET', 'colors.json', true);
    r.onreadystatechange = function () {
        if (r.readyState != 4 || r.status != 200)
            return;

        //复制
        var colors_Array = JSON.parse(r.responseText);
        for (var index = 0; index < colors_Array.length; index++) {
            var element = colors_Array[index];
            vm_color.colors.push(element);

        }
        handleColors(r.responseText);
    };
    r.send();

    document.getElementById('js-id-paypal-button').addEventListener('mouseenter', function () {
        document.getElementById('js-id-paypal-button').style.display = 'none';
        document.getElementById('js-id-select').style.display = '';
    });

    document.getElementById('js-id-select').addEventListener('mouseleave', function () {
        document.getElementById('js-id-paypal-button').style.display = '';
        document.getElementById('js-id-select').style.display = 'none';
    });

    document.getElementById('RGBcolor').addEventListener('mouseenter', function () {
        document.getElementById('RGBvalue').style.opacity = 1;
    });
    document.getElementById('RGBcolor').addEventListener('mouseleave', function () {
        document.getElementById('RGBvalue').style.opacity = 0;
    });

    window.onpopstate = function () {
        hashRenderColor();
    };
};


