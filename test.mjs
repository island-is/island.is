// @ts-check

fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    body: JSON.stringify({
        client_id: 'Iv1.c54a0a4a75cde1c9',
        client_secret: '3758ec7768f54335a228d9d7616fd8a9d049c3e4',
        code: 'hehee'
    })
}).then((value) => {
    value.text().then((data) => {
        console.log(data);
    })
})