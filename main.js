// ==UserScript==
// @name         Peek-Boss [窥视Boss直聘]
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       maple
// @license      Apache License 2.0
// @description  偷偷查看Boss直聘;作用于公司上班环境，不适合查看boss的场景。修改了boss的图标以及标题。
// @require      https://unpkg.com/maple-lib@1.0.3/log.js
// @match        https://www.zhipin.com/*
// @icon         https://www.zhipin.com/favicon.ico
// @grant        GM_addStyle
// ==/UserScript==
'use strict';

let logger = Logger.log("info")


class MockBossConfig {
    constructor() {
        this.title = "debug"
        this.iconUrl = "https://www.baidu.com/favicon.ico";
        this.logoUrl = "https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png";
        this.logoText = "百度一下";
    }

    getTitle() {
        return this.title;
    }

    getIconUrl() {
        return this.iconUrl;
    }
}

class PeekBoss {
    constructor() {
        this.mbc = new MockBossConfig()
        this.init();
    }

    init() {
        this.registerStyle();
        try {
            this.mockTitle();
            this.mockIcon();
            this.mockLogo();
        } catch(e) {
            logger.debug("初始替换报错", e)
        }
        this.continueMock();
    }

    registerStyle() {
        // 页面logo替换 + pageHeader颜色修改
        GM_addStyle(`
        .logo a {
            display: block;
            background: url(${this.mbc.logoUrl}) 0 0 no-repeat;
            background-size: 113px 21px;
        }

        #header {
            background:#97a5a166;
        }
        `)
    }

    continueMock() {
        setInterval(() => {
            this.mockTitle();
            this.mockIcon();
            this.mockLogo();
        }, 2000)
    }

    mockTitle() {
        document.title = this.mbc.getTitle();
    }

    mockIcon() {
        document.head.querySelector('[rel="shortcut icon"]').href = this.mbc.getIconUrl();
    }

    mockLogo() {
        let logoDivTag = document.querySelector(".logo");
        if (!logoDivTag) {
            return;
        }
        let logoATag = logoDivTag.querySelector("a");
        logoATag.title = this.mbc.logoText;
    }

    mockPageHead() {
        let headDivTag = document.getElementById("header");
    }


}



(function () {
    window.addEventListener("load", () => {
        new PeekBoss();
    })
})();