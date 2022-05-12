const ejs = require("ejs");
const fs = require("fs");
const pdf = require("html-pdf");
const qrcode = require("qrcode");
const template = ejs.compile(fs.readFileSync("./template/qrcode.ejs", "utf8"), {
  async: false,
  cache: false,
});
const assets = [
  {
    qrcode: "1",
  },
  {
    qrcode: "2",
  },
  {
    qrcode: "1",
  },
  {
    qrcode: "2",
  },
  {
    qrcode: "1",
  },
  {
    qrcode: "2",
  },
];
(async () => {
  const opts = {
    width: 200,
    height: 90,
  }
  const qrcodeSize = opts.width/3 > opts.height ? opts.height : opts.width/3;
  const logoSize = opts.width/3 > opts.height ? opts.height : opts.width/3
  const mapAsset = await Promise.all(
    assets.map(async (asset) => {
      return {
        ...asset,
        qrcode_image: await qrcode.toDataURL("abc", {
            margin: 0,
            width:qrcodeSize
        }),
      };
    })
  );
  const html = template({
    assets: mapAsset,
    qrcode: {
      size: qrcodeSize,
    },
    logo: {
      size: logoSize / 2,
      image: fs.readFileSync('fm-logo.png', 'base64'),
    }
  });
  console.log(html)
  fs.writeFileSync("./index.html", html);
  pdf
    .create(html, {
      format: "Letter",
      width: opts.width,
      height: opts.height,
      quality: 100,
    })
    .toFile("./qrcode.pdf", function (err, res) {
      if (err) return console.log(err);
      console.log(res); // { filename: '/app/businesscard.pdf' }
    });
})();
