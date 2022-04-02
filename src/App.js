import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

export default function App() {
  const [zip, setZip] = useState(""); //　郵便番号（入力）
  const [displayZip, setDisplayZip] = useState(""); //　郵便番号（表示）
  const [area, setArea] = useState(); // 取得したエリアデータ
  const [address, setAddress] = useState(""); //　住所
  const [kana, setKana] = useState(""); //　住所（仮名）

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`)
        .then((res) => {
          setArea(res);
        })
        .catch((err) => alert("データがうまく取得できませんでした"));
    };
    fetchData();
  }, [zip]); /// zipの値が更新されたら実行

  const onClickGetArea = () => {
    // 未入力だったらアラートを表示
    if (zip === "") {
      alert("郵便番号を入力してください");
      return;
    }

    // 住所をクリア
    setAddress("");
    setKana("");
    setDisplayZip("");
    // 郵便番号をクリア
    setZip("");

    // 郵便番号の桁数が不正の場合のメッセージ
    if (area.data.message) {
      setAddress(area.data.message);
      return;
    }

    // 郵便番号が存在しない場合のエラーメッセージ
    if (area.data.results == null) {
      alert("郵便番号が見つかりませんでした");
      return;
    }

    // 住所を変数に格納
    const address1 = area.data.results[0].address1;
    const address2 = area.data.results[0].address2;
    const address3 = area.data.results[0].address3;
    const kana1 = area.data.results[0].kana1;
    const kana2 = area.data.results[0].kana2;
    const kana3 = area.data.results[0].kana3;
    // 表示する郵便番号を変数に格納
    const zipcode = area.data.results[0].zipcode;

    // 住所と郵便番号をSetする
    setAddress(address1 + address2 + address3);
    setKana(kana1 + kana2 + kana3);
    setDisplayZip(zipcode);
  };

  const inputStyle = {
    border: "1px solid #ccc",
    padding: "5px 10px",
    borderRadius: "4px",
    marginRight: "10px"
  };

  const h1Style = {
    fontSize: "1.2em",
    color: "#b09851",
    background: "#e9e1c8",
    padding: "5px 10px"
  };

  return (
    <div>
      <h1 style={h1Style}>住所検索サンプル</h1>
      <p>郵便番号を入力して「住所検索」ボタンをクリックしてください</p>
      <input
        style={inputStyle}
        type="text"
        value={zip}
        placeholder="郵便番号を入力してください"
        onChange={(e) => setZip(e.target.value)}
      />
      <button onClick={onClickGetArea}>住所検索</button>
      <p>{displayZip ? `〒${displayZip}` : ""}</p>
      <p>
        <ruby>
          {address}
          <rt>{kana}</rt>
        </ruby>
      </p>
    </div>
  );
}
