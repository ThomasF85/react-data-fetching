import { useEffect, useState } from "react";
import useSWR from "swr";

function useFetch(url) {
  const [data, setData] = useState();

  useEffect(() => {
    async function startFetching() {
      const response = await fetch(url);
      const newData = await response.json();

      setData(newData);
    }

    startFetching();
  }, [url]);

  return data;
}

export default function Joke() {
  const [id, setId] = useState(0);
  const [jokesInfo, setJokesInfo] = useState([]);

  const { data, error, isLoading } = useSWR(
    `https://example-apis.vercel.app/api/bad-jokes/${id}`
  );

  function handlePrevJoke() {
    setId(data.prevId);
  }

  function handleNextJoke() {
    setId(data.nextId);
  }

  if (error) {
    return <h1>An error occured, please load the page again</h1>;
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const jokeInfo = jokesInfo.find((info) => info.id === id);
  const isFunny = jokeInfo ? jokeInfo.isFunny : false;

  function handleToggleFunny(id) {
    setJokesInfo((prevJokesInfo) => {
      if (!prevJokesInfo.find((joke) => joke.id === id)) {
        return [
          ...prevJokesInfo,
          {
            id: id,
            isFunny: true,
          },
        ];
      } else {
        return prevJokesInfo.map((joke) => {
          if (joke.id === id) {
            return { ...joke, isFunny: !joke.isFunny };
          }
          return joke;
        });
      }
    });
  }

  return (
    <>
      <small>ID: {id}</small>
      <h1>
        {data.joke}{" "}
        <span
          role="img"
          aria-label={isFunny ? "A laughing face" : "An unamused face"}
        >
          {isFunny ? "🤣" : "😒"}
        </span>
      </h1>
      <div>
        <button
          type="button"
          onClick={() => {
            handleToggleFunny(id);
          }}
        >
          {isFunny ? "Stop laughing" : "Start laughing"}
        </button>
      </div>
      <div>
        <button type="button" onClick={handlePrevJoke}>
          ← Prev Joke
        </button>
        <button type="button" onClick={handleNextJoke}>
          Next Joke →
        </button>
      </div>
    </>
  );
}
