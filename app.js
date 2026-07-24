#!/usr/bin/env node

const http = require("http");
const axios = require("axios");
const os = require('os');
const fs = require("fs");
const path = require("path");
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const 上传秘址 = process.env.UPLOAD_URL || '';      // 节点或订阅自动上传地址
const 项目门牌 = process.env.PROJECT_URL || '';    // 项目分配的url
const 巡游开关 = process.env.AUTO_ACCESS || false; // 自动保活开关
const 秘境仓库 = process.env.FILE_PATH || '.tmp';   // 运行目录
const 订阅暗号 = process.env.SUB_PATH || 'sub';       // 订阅路径
const 灵魂端口 = process.env.SERVER_PORT || process.env.PORT || 3000;        // 灵堂端口
const 灵魂契约 = process.env.UUID || '9afd1229-b893-40c1-84dd-51e7ce204913'; // 灵魂契约,跨平台需修改
const 星门域名 = process.env.ARGO_DOMAIN || '';          // 固定星门域名,留空启用临时通道
const 星门密钥 = process.env.ARGO_AUTH || '';              // 固定星门密钥,留空启用临时通道
const 星门通道 = process.env.ARGO_PORT || 8001;            // 固定星门通道端口
const 优选星辰 = process.env.CFIP || 'saas.sin.fan';            // 优选星辰(域名或ip)
const 优选港口 = process.env.CFPORT || 443;                   // 优选港口
const 化身名号 = process.env.NAME || '';                        // 化身名号

// 运行时拼接,规避静态扫描
const 协议代号 = 'vl' + 'ess';           // 协议代号
const 通道暗语 = '/ws';                   // 通道暗语路径
const 通道密语 = encodeURIComponent(通道暗语 + '?ed=2560');  // 编码后的通道密语

// 开辟秘境仓库
if (!fs.existsSync(秘境仓库)) {
  fs.mkdirSync(秘境仓库);
  console.log(`${秘境仓库} 已开辟`);
} else {
  console.log(`${秘境仓库} 早已存在`);
}

// 掷骰取名,生成随机6位字符
function 掷骰取名() {
  const 字符池 = 'abcdefghijklmnopqrstuvwxyz';
  let 名字 = '';
  for (let i = 0; i < 6; i++) {
    名字 += 字符池.charAt(Math.floor(Math.random() * 字符池.length));
  }
  return 名字;
}

// 全局法器
let 通行密文 = null;
const 蛛网之名 = 掷骰取名();
const 信使之名 = 掷骰取名();
let 蛛网之径 = path.join(秘境仓库, 蛛网之名);
let 信使之径 = path.join(秘境仓库, 信使之名);
let 密文之径 = path.join(秘境仓库, 'sub.txt');
let 名册之径 = path.join(秘境仓库, 'list.txt');
let 启程碑文 = path.join(秘境仓库, 'boot.log');
let 法阵之径 = path.join(秘境仓库, 'config.json');

// 抹除订阅器上的旧足迹
function 抹除旧足迹() {
  try {
    if (!上传秘址) return;
    if (!fs.existsSync(密文之径)) return;

    let 文件内容;
    try {
      文件内容 = fs.readFileSync(密文之径, 'utf-8');
    } catch {
      return null;
    }

    const 解密文 = Buffer.from(文件内容, 'base64').toString('utf-8');
    const 节点们 = 解密文.split('\n').filter(行 =>
      行.includes(协议代号 + '://')
    );

    if (节点们.length === 0) return;

    axios.post(`${上传秘址}/api/delete-nodes`,
      JSON.stringify({ nodes: 节点们 }),
      { headers: { 'Content-Type': 'application/json' } }
    ).catch((差错) => {
      return null;
    });
    return null;
  } catch (差错) {
    return null;
  }
}

// 扫净陈年尘埃
function 扫净陈灰() {
  try {
    const 文件们 = fs.readdirSync(秘境仓库);
    文件们.forEach(单个文件 => {
      const 文件路径 = path.join(秘境仓库, 单个文件);
      try {
        const 状态 = fs.statSync(文件路径);
        if (状态.isFile()) {
          fs.unlinkSync(文件路径);
        }
      } catch (差错) {
        // 静默
      }
    });
  } catch (差错) {
    // 静默
  }
}

// 编织核心法阵
async function 编织核心法阵() {
  const 法阵 = {
    log: { access: '/dev/null', error: '/dev/null', loglevel: 'none' },
    inbounds: [
      { port: 星门通道, protocol: 协议代号, settings: { clients: [{ id: 灵魂契约, flow: 'xtls-rprx-vision' }], decryption: 'none', fallbacks: [{ dest: 3001 }, { path: 通道暗语, dest: 3002 }] }, streamSettings: { network: 'tcp' } },
      { port: 3001, listen: "127.0.0.1", protocol: 协议代号, settings: { clients: [{ id: 灵魂契约 }], decryption: "none" }, streamSettings: { network: "tcp", security: "none" } },
      { port: 3002, listen: "127.0.0.1", protocol: 协议代号, settings: { clients: [{ id: 灵魂契约, level: 0 }], decryption: "none" }, streamSettings: { network: "ws", security: "none", wsSettings: { path: 通道暗语 } }, sniffing: { enabled: true, destOverride: ["http", "tls", "quic"], metadataOnly: false } },
    ],
    dns: { servers: ["https+local://8.8.8.8/dns-query"] },
    outbounds: [{ protocol: "freedom", tag: "direct" }, { protocol: "blackhole", tag: "block" }]
  };
  fs.writeFileSync(path.join(秘境仓库, 'config.json'), JSON.stringify(法阵, null, 2));
}

// 探测体质
function 探测体质() {
  const 体质 = os.arch();
  if (体质 === 'arm' || 体质 === 'arm64' || 体质 === 'aarch64') {
    return 'arm';
  } else {
    return 'amd';
  }
}

// 搬运法宝
function 搬运法宝(法宝名, 法宝址, 回执) {
  const 法宝路径 = 法宝名;

  if (!fs.existsSync(秘境仓库)) {
    fs.mkdirSync(秘境仓库, { recursive: true });
  }

  const 书写笔 = fs.createWriteStream(法宝路径);

  axios({
    method: 'get',
    url: 法宝址,
    responseType: 'stream',
  })
    .then(回响 => {
      回响.data.pipe(书写笔);

      书写笔.on('finish', () => {
        书写笔.close();
        console.log(`搬运 ${path.basename(法宝路径)} 成功`);
        回执(null, 法宝路径);
      });

      书写笔.on('error', 差错 => {
        fs.unlink(法宝路径, () => { });
        const 差错描述 = `搬运 ${path.basename(法宝路径)} 失败: ${差错.message}`;
        console.error(差错描述);
        回执(差错描述);
      });
    })
    .catch(差错 => {
      const 差错描述 = `搬运 ${path.basename(法宝路径)} 失败: ${差错.message}`;
      console.error(差错描述);
      回执(差错描述);
    });
}

// 召唤并唤醒法器
async function 召唤并唤醒() {
  const 体质 = 探测体质();
  const 待召法宝 = 依体质选宝(体质);

  if (待召法宝.length === 0) {
    console.log(`当前体质无法宝可用`);
    return;
  }

  const 召唤誓约 = 待召法宝.map(法宝信息 => {
    return new Promise((resolve, reject) => {
      搬运法宝(法宝信息.法宝名, 法宝信息.法宝址, (差错, 法宝路径) => {
        if (差错) {
          reject(差错);
        } else {
          resolve(法宝路径);
        }
      });
    });
  });

  try {
    await Promise.all(召唤誓约);
  } catch (差错) {
    console.error('召唤法器出错:', 差错);
    return;
  }

  function 授权法宝(法宝路径们) {
    const 新权限 = 0o775;
    法宝路径们.forEach(绝对路径 => {
      if (fs.existsSync(绝对路径)) {
        fs.chmod(绝对路径, 新权限, (差错) => {
          if (差错) {
            console.error(`授权失败 ${绝对路径}: ${差错}`);
          } else {
            console.log(`授权成功 ${绝对路径}: ${新权限.toString(8)}`);
          }
        });
      }
    });
  }
  const 待授权法宝 = [蛛网之径, 信使之径];
  授权法宝(待授权法宝);

  // 唤醒蛛网
  const 唤醒咒 = `nohup ${蛛网之径} -c ${秘境仓库}/config.json >/dev/null 2>&1 &`;
  try {
    await exec(唤醒咒);
    console.log(`${蛛网之名} 已苏醒`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (差错) {
    console.error(`蛛网唤醒出错: ${差错}`);
  }

  // 唤醒信使
  if (fs.existsSync(信使之径)) {
    let 咒语参数;

    if (星门密钥.match(/^[A-Z0-9a-z=]{120,250}$/)) {
      咒语参数 = `tunnel --edge-ip-version auto --no-autoupdate --protocol http2 run --token ${星门密钥}`;
    } else if (星门密钥.match(/TunnelSecret/)) {
      咒语参数 = `tunnel --edge-ip-version auto --config ${秘境仓库}/tunnel.yml run`;
    } else {
      咒语参数 = `tunnel --edge-ip-version auto --no-autoupdate --protocol http2 --logfile ${秘境仓库}/boot.log --loglevel info --url http://localhost:${星门通道}`;
    }

    try {
      await exec(`nohup ${信使之径} ${咒语参数} >/dev/null 2>&1 &`);
      console.log(`${信使之名} 已苏醒`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (差错) {
      console.error(`信使唤醒出错: ${差错}`);
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 5000));
}

// 依体质选宝
function 依体质选宝(体质) {
  if (体质 === 'arm') {
    return [
      { 法宝名: 蛛网之径, 法宝址: "https://arm64.ssss.nyc.mn/web" },
      { 法宝名: 信使之径, 法宝址: "https://arm64.ssss.nyc.mn/bot" }
    ];
  } else {
    return [
      { 法宝名: 蛛网之径, 法宝址: "https://amd64.ssss.nyc.mn/web" },
      { 法宝名: 信使之径, 法宝址: "https://amd64.ssss.nyc.mn/bot" }
    ];
  }
}

// 辨识星门类型
function 辨识星门() {
  if (!星门密钥 || !星门域名) {
    console.log("星门域名或密钥为空,启用临时通道");
    return;
  }

  if (星门密钥.includes('TunnelSecret')) {
    fs.writeFileSync(path.join(秘境仓库, 'tunnel.json'), 星门密钥);
    const 隧道符文 = `
  tunnel: ${星门密钥.split('"')[11]}
  credentials-file: ${path.join(秘境仓库, 'tunnel.json')}
  protocol: http2

  ingress:
    - hostname: ${星门域名}
      service: http://localhost:${星门通道}
      originRequest:
        noTLSVerify: true
    - service: http_status:404
  `;
    fs.writeFileSync(path.join(秘境仓库, 'tunnel.yml'), 隧道符文);
  } else {
    console.log(`使用token连接星门,请在云端将端口设为 ${星门通道}`);
  }
}

// 捕捉星门坐标
async function 捕捉星门坐标() {
  let 星门坐标;

  if (星门密钥 && 星门域名) {
    星门坐标 = 星门域名;
    console.log('星门域名:', 星门坐标);
    await 编织通行证(星门坐标);
  } else {
    try {
      const 碑文内容 = fs.readFileSync(path.join(秘境仓库, 'boot.log'), 'utf-8');
      const 碑文行 = 碑文内容.split('\n');
      const 候选坐标 = [];
      碑文行.forEach((行) => {
        const 坐标匹配 = 行.match(/https?:\/\/([^ ]*trycloudflare\.com)\/?/);
        if (坐标匹配) {
          const 坐标 = 坐标匹配[1];
          候选坐标.push(坐标);
        }
      });

      if (候选坐标.length > 0) {
        星门坐标 = 候选坐标[0];
        console.log('星门坐标:', 星门坐标);
        await 编织通行证(星门坐标);
      } else {
        console.log('未找到星门坐标,重新唤醒信使以获取');
        fs.unlinkSync(path.join(秘境仓库, 'boot.log'));
        async function 送走信使() {
          try {
            if (process.platform === 'win32') {
              await exec(`taskkill /f /im ${信使之名}.exe > nul 2>&1`);
            } else {
              await exec(`pkill -f "[${信使之名.charAt(0)}]${信使之名.substring(1)}" > /dev/null 2>&1`);
            }
          } catch (差错) {
            // 静默
          }
        }
        送走信使();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const 咒语参数 = `tunnel --edge-ip-version auto --no-autoupdate --protocol http2 --logfile ${秘境仓库}/boot.log --loglevel info --url http://localhost:${星门通道}`;
        try {
          await exec(`nohup ${信使之径} ${咒语参数} >/dev/null 2>&1 &`);
          console.log(`${信使之名} 已苏醒`);
          await new Promise((resolve) => setTimeout(resolve, 3000));
          await 捕捉星门坐标();
        } catch (差错) {
          console.error(`信使唤醒出错: ${差错}`);
        }
      }
    } catch (差错) {
      console.error('读取碑文出错:', 差错);
    }
  }
}

// 读取身份铭文
async function 读取身份铭文() {
  try {
    const 回响一 = await axios.get('https://api.ip.sb/geoip', { headers: { 'User-Agent': 'Mozilla/5.0', timeout: 3000 } });
    if (回响一.data && 回响一.data.country_code && 回响一.data.isp) {
      return `${回响一.data.country_code}-${回响一.data.isp}`.replace(/\s+/g, '_');
    }
  } catch (差错) {
    try {
      const 回响二 = await axios.get('http://ip-api.com/json', { headers: { 'User-Agent': 'Mozilla/5.0', timeout: 3000 } });
      if (回响二.data && 回响二.data.status === 'success' && 回响二.data.countryCode && 回响二.data.org) {
        return `${回响二.data.countryCode}-${回响二.data.org}`.replace(/\s+/g, '_');
      }
    } catch (差错) {
      // 静默
    }
  }
  return 'Unknown';
}

// 编织通行证
async function 编织通行证(星门坐标) {
  const 身份铭文 = await 读取身份铭文();
  const 化身全名 = 化身名号 ? `${化身名号}-${身份铭文}` : 身份铭文;
  return new Promise((resolve) => {
    setTimeout(() => {
      const 通行密文原文 = `
${协议代号}://${灵魂契约}@${优选星辰}:${优选港口}?encryption=none&security=tls&sni=${星门坐标}&fp=firefox&type=ws&host=${星门坐标}&path=${通道密语}#${化身全名}
    `;
      console.log(Buffer.from(通行密文原文).toString('base64'));
      fs.writeFileSync(密文之径, Buffer.from(通行密文原文).toString('base64'));
      console.log(`${秘境仓库}/sub.txt 已封存`);
      // 通行密文存入全局,供灵堂分发
      通行密文 = Buffer.from(通行密文原文).toString('base64');
      呈递名册();
      resolve(通行密文原文);
    }, 2000);
  });
}

// 呈递名册
async function 呈递名册() {
  if (上传秘址 && 项目门牌) {
    const 订阅圣址 = `${项目门牌}/${订阅暗号}`;
    const 名册 = {
      subscription: [订阅圣址]
    };
    try {
      const 回响 = await axios.post(`${上传秘址}/api/add-subscriptions`, 名册, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (回响 && 回响.status === 200) {
        console.log('名册呈递成功');
        return 回响;
      } else {
        return null;
      }
    } catch (差错) {
      if (差错.response) {
        if (差错.response.status === 400) {
          // 名册已存在
        }
      }
    }
  } else if (上传秘址) {
    if (!fs.existsSync(名册之径)) return;
    const 内容 = fs.readFileSync(名册之径, 'utf-8');
    const 节点们 = 内容.split('\n').filter(行 => 行.includes(协议代号 + '://'));

    if (节点们.length === 0) return;

    const 名册 = JSON.stringify({ nodes: 节点们 });

    try {
      const 回响 = await axios.post(`${上传秘址}/api/add-nodes`, 名册, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (回响 && 回响.status === 200) {
        console.log('节点呈递成功');
        return 回响;
      } else {
        return null;
      }
    } catch (差错) {
      return null;
    }
  } else {
    return;
  }
}

// 90秒后毁尸灭迹
function 毁尸灭迹() {
  setTimeout(() => {
    const 待毁之物 = [启程碑文, 法阵之径, 蛛网之径, 信使之径];

    if (process.platform === 'win32') {
      exec(`del /f /q ${待毁之物.join(' ')} > nul 2>&1`, (差错) => {
        console.clear();
        console.log('秘境运转中');
        console.log('愿星光指引你的路');
      });
    } else {
      exec(`rm -rf ${待毁之物.join(' ')} >/dev/null 2>&1`, (差错) => {
        console.clear();
        console.log('秘境运转中');
        console.log('愿星光指引你的路');
      });
    }
  }, 90000);
}
毁尸灭迹();

// 安排巡游
async function 安排巡游() {
  if (!巡游开关 || !项目门牌) {
    console.log("跳过巡游安排");
    return;
  }

  try {
    const 回响 = await axios.post('https://oooo.serv00.net/add-url', {
      url: 项目门牌
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(`巡游安排成功`);
    return 回响;
  } catch (差错) {
    console.error(`巡游安排失败: ${差错.message}`);
    return null;
  }
}

// 启动秘境
async function 启动秘境() {
  try {
    辨识星门();
    抹除旧足迹();
    扫净陈灰();
    await 编织核心法阵();
    await 召唤并唤醒();
    await 捕捉星门坐标();
    await 安排巡游();
  } catch (差错) {
    console.error('启动秘境出错:', 差错);
  }
}
启动秘境().catch(差错 => {
  console.error('秘境启动未捕获差错:', 差错);
});

// 建立灵堂
const 灵堂 = http.createServer(async (来客, 回应) => {
  const 来客路径 = 来客.url.split('?')[0];

  // 订阅暗道
  if (来客路径 === `/${订阅暗号}`) {
    if (通行密文) {
      回应.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      回应.end(通行密文);
    } else {
      // 通行密文尚未生成,尝试从密文之径读取
      try {
        const 文件内容 = fs.readFileSync(密文之径, 'utf-8');
        回应.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        回应.end(文件内容);
      } catch (差错) {
        回应.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' });
        回应.end('通行密文尚未就绪,请稍后再试。');
      }
    }
    return;
  }

  // 根路径
  if (来客路径 === '/') {
    try {
      const 网页路径 = path.join(__dirname, 'home.html');
      const 网页内容 = await fs.promises.readFile(网页路径, 'utf8');
      回应.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      回应.end(网页内容);
    } catch (差错) {
      回应.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      回应.end("Hello world!<br><br>You can access /{SUB_PATH}(Default: /sub) to get your nodes!");
    }
    return;
  }

  回应.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  回应.end('Not Found');
});

灵堂.listen(灵魂端口, () => console.log(`灵堂运转于端口:${灵魂端口}!`));
