/*
 * 添加当前页面浮动图标
 */
function (this) {
	var $$ = $(this);
	var lr = tb = true;
	window.setInterval(function () {
		var browserInfo = {width: window.innerWidth, height: window.innerHeight},
			inputInfo = {width: $$.width(), height: $$.height()},
			left = parseInt($$.css('left')),
			top = parseInt($$.css('top'));

		if (lr) {
			if (left < browserInfo.width - inputInfo.width) {
				left = left + 1 + 'px';
			} else {
				lr = false;
			}
		} else {
			if (left > 0) {
				left = left - 1 + 'px';
			} else {
				lr = true;
			}
		}

		if (tb) {
			if (top < browserInfo.height - inputInfo.height) {
			    top = top + 1 + 'px';
			} else {
			    tb = false;
			}
		} else {
			if (top > 0) {
			    top = top - 1 + 'px';
			} else {
			    tb = true;
			}
		}

		$$.css({
			left: left,
			top: top,
		});
	}, 50);
}

/*
 * 解析 URL 信息
 */
function getUrlInfo(url) {
    var params = {};
    url = url.split("?");
    if (url[1] != undefined) {
        $(url[1].split("&")).each(function (key, value) {
            value = value.split("=");
            if (value[1] != undefined) {
                params[value[0]] = value[1];
            } else {
                params[value[0]] = "";
            }
        });
    }

    return {
        'host': url[0],
        'params': params,
    };
}

/*
 * 获取 URL 链接
 */
function getUrl(urlInfo) {
    var url = "";

    if (urlInfo.host != undefined) {
        url += urlInfo.host;
    }

    if (urlInfo.params != undefined) {
        url += "?";
        for(key in urlInfo.params) {
            if (!/\?$/.test(url)) {
                url += "&";
            }
            url += key + "=" + urlInfo.params[key];
        }
    }

    return url;
}

/*
 * 跳过当前页面，不加入缓存
 */
function fnUrlReplace(eleLink) {
	var link = eleLink;
	var linkInfo = getUrlInfo(link);
	link = getUrl(linkInfo);

	if (history.replaceState) {
	    history.replaceState(null, document.title, link.split('#')[0] + '#');
	    location.replace('');
	} else {
	    location.replace(link);
	}
};

/*
 * 加载 JQuery
 */
function loadScript(callback) {
	var script = document.createElement("script");
	script.type = "text/javascript";
	if(typeof(callback) != "undefined"){
		if (script.readyState) {
			script.onreadystatechange = function () {
				if (script.readyState == "loaded" || script.readyState == "complete") {
					script.onreadystatechange = null;
					callback();
				}
			};
		} else {
			script.onload = function () {
				callback();
			};
		}
	}
	script.src = "https://code.jquery.com/jquery-3.2.0.min.js";
	document.body.appendChild(script);
}

/*
 * 服务于 Google 翻译 tk 值
 */
function b(a, b) {
	var c;

    for (var d = 0; d < b.length - 2; d += 3) {
        c = b.substr(d + 2, 1);
        if ("a" <= c) {
        	c = c.charCodeAt(0) - 87;
        } else {
        	c = parseInt(c);
        }

        if ("+" == b.substr(d + 1, 1)) {
        	c = a >>> c;
        } else {
        	c = a << c;
        }

        if ("+" == b.substr(d, 1)) {
        	a = a + c & 4294967295;
        } else {
        	a = a ^ c;
        }
    }

    return a;
}

/*
 * 获取 Google 翻译 tk 值
 *
 * a 要翻译的内容
 * TKK Google 返回的值
 */
function tk(a, TKK) {
	var e = TKK.split("."), 
		h = parseInt(e[0]) || 0, 
		g = [],
		d = 0,
		c;

    for (var f = 0; f < a.length; f++) {
        c = a.charCodeAt(f);
        if (128 > c) {
        	g[d++] = c;
        } else {
        	if (2048 > c) {
        		g[d++] = c >> 6 | 192;
        	} else {
        		if (55296 == (c & 64512) 
        			&& f + 1 < a.length 
        			&& 56320 == (a.charCodeAt(f + 1) & 64512)) {
        			c = 65536 + ((c & 1023) << 10) + (a.charCodeAt(++f) & 1023);
        			g[d++] = c >> 18 | 240;
        			g[d++] = c >> 12 & 63 | 128;
        		} else {
        			g[d++] = c >> 12 | 224;
        			g[d++] = c >> 6 & 63 | 128;
        		}
        	}
        	g[d++] = c & 63 | 128;
        }
    }

    a = h;
    for (d = 0; d < g.length; d++) {
    	a += g[d];
    	a = b(a, "+-a^+6");
    }

    a = b(a, "+-3^+b+-f");
    a ^= parseInt(e[1]) || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1E6;

    return a.toString() + "." + (a ^ h)
}