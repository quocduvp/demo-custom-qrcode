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
    width: 310,
    height: 90,
  }
  const mapAsset = await Promise.all(
    assets.map(async (asset) => {
      return {
        ...asset,
        qrcode_image: await qrcode.toDataURL("abc", {
            margin: 0,
            width: opts.width/3
        }),
      };
    })
  );
  const html = template({
    assets: mapAsset,
  });
  fs.writeFileSync("./index.html", html);
  pdf
    .create(html, {
      format: "Letter",
      width: opts.width,
      height: opts.height,
      quality: 100
    })
    .toFile("./qrcode.pdf", function (err, res) {
      if (err) return console.log(err);
      console.log(res); // { filename: '/app/businesscard.pdf' }
    });
})();
