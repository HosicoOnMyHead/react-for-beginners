import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  const [amount, setAmount] = useState(0);
  const [inverted, setInverted] = useState(false);
  const [converted, setConverted] = useState([]);
  const onChange = (event) => setAmount(event.target.value);
  const reset = () => setAmount(0);
  const onFlip = () => {
    reset();
    setInverted((current) => !inverted);
  };
  useEffect(() => {
    fetch("https://api.coinpaprika.com/v1/tickers")
      .then((response) => response.json())
      .then((json) => {
        setCoins(json);
        setLoading(false);
      });
  }, []);
  const coinValue = (event) => {
    const option = event.target.value;
    const name = option.substring(0, option.indexOf(" "));
    const unit = option.substring(
      option.indexOf(" ", option.indexOf(" ") + 1),
      option.lastIndexOf(" ")
    );
    const symbol = option.substring(
      option.indexOf("(") + 1,
      option.indexOf(")")
    );
    setConverted({
      name,
      unit,
      symbol,
    });
  };

  return (
    <div>
      <h1>The Coins! {loading ? null : `(${coins.length})`}</h1>
      {loading ? (
        <strong>Loading...</strong>
      ) : (
        <select onChange={coinValue}>
          <option key="-1">Select Option</option>
          {coins.map((coin) => (
            <option key={coin.id}>
              {coin.name} ({coin.symbol}): {coin.quotes.USD.price} USD
            </option>
          ))}
        </select>
      )}
      <hr />
      <div>
        <label id="cash">You have </label>
        <input
          onChange={onChange}
          id="cash"
          type="number"
          value={inverted ? amount * converted.unit : amount}
          disabled={inverted}
        />
        USD
      </div>
      <div>
        <label id="coin">Applied {converted.name} </label>
        <input
          onChange={onChange}
          id="coin"
          type="number"
          value={inverted ? amount : amount / converted.unit}
          disabled={!inverted}
        />
        {converted.symbol}
      </div>
      <button onClick={reset}>Reset</button>
      <button onClick={onFlip}>{inverted ? "Trun back" : "Invert"}</button>
    </div>
  );
}

export default App;
