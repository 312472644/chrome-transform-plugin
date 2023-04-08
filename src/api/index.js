import md5 from 'js-md5';
import axios from "axios";
import CryptoJS from 'crypto-js';

const transFormYoudao = (params = { from: '', to: '', q: '' }) => {
  const appKey = '053b89e759412c96';
  const key = '9y85EsnjN00kt4NtM58knqqFo4qaPaf9';
  const salt = (new Date).getTime();
  const curtime = Math.round(new Date().getTime() / 1000);
  const strSign = appKey + truncate(params.q) + salt + curtime + key;
  const sign = CryptoJS.SHA256(strSign).toString(CryptoJS.enc.Hex);

  function truncate(q) {
    var len = q.length;
    if (len <= 20) return q;
    return q.substring(0, 10) + len + q.substring(len - 10, len);
  }
  return axios.get(import.meta.env.VITE_APP_YOUDAO_URL, {
    params: {
      q: params.q,
      appKey,
      salt,
      from: params.from,
      to: params.to,
      sign: sign,
      signType: "v3",
      curtime,
    }
  });
}

const transFromBaidu = (params = {
  from: 'zh',
  to: 'en',
  q: ''
}) => {
  const appid = '20230407001631753';
  const appKey = 'rhtmXkepsfdxb15_EseO';
  const salt = +new Date();
  const sign = md5(`${appid}${params.q}${salt}${appKey}`);

  return axios.get(`${import.meta.env.VITE_APP_BAIDU_URL}/api/trans/vip/translate?q=${params.q}&from=${params.from}&to=${params.to}&appid=${appid}&salt=${salt}&sign=${sign}`)
}

const transFormYoudaoV2 = (q) => {
  return axios.get(`${import.meta.env.VITE_APP_API}/translate?&doctype=json&type=AUTO&i=${q}`);
}

export { transFromBaidu, transFormYoudao, transFormYoudaoV2 }