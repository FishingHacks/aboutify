// this file contains the Flag, close it please
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
const puppeteer = require('puppeteer');
module.exports.review=async (url)=>{
        const browser = await puppeteer.launch({
                args: ["--no-sandbox"],
                executablePath: require("./browser")
        });
        const page = await browser.newPage();
        let u = new URL(url);
        u.searchParams.set("flag", "CTF{Ch3ck7yp3s}");
        page.setExtraHTTPHeaders({noInfo: "true"});
        await page.goto(u.href);
        await page.screenshot({ path: 'example.png' });
        await browser.close();
}