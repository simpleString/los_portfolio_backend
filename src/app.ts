import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs/promises";

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const port = 5000;

interface IPostData {
  img: string;
  postUrl: string;
  title: string;
}

interface IGameData {
  img: string;
  postUrl: string;
  title: string;
  type: "topical" | "old" | "completed";
}

app.get("/posts", async (req, res) => {
  const result = await fs.readdir("public/posts");
  const postData: IPostData[] = await Promise.all(
    result.map(async (item) => {
      return {
        img: `${item}/Main.jpeg`,
        postUrl: `${item}`,
        title: (
          await fs.readFile(`./public/posts/${item}/Title.txt`)
        ).toString(),
      };
    })
  );
  console.log(postData);

  res.json(postData);
});

app.get("/games", async (req, res) => {
  const result = await fs.readdir("public/games");
  const data: IGameData[] = [];
  await Promise.all(
    result.map(async (item) => {
      const innerDir = await fs.readdir(`public/games/${item}`);
      await Promise.all(
        innerDir.map(async (innerItem) => {
          data.push({
            img: `${item}/${innerItem}/Main.jpeg`,
            postUrl: `${item}/${innerItem}`,
            title: (
              await fs.readFile(`./public/games/${item}/${innerItem}/Title.txt`)
            ).toString(),
            type: item as any,
          });
        })
      );
    })
  );
  console.log(data);

  res.json(data);
});

app.get("/games/topical:slug", async (req, res) => {
  const { slug } = req.params;
  const result = (
    await fs.readFile(`public/games/topical/${slug}/Title.txt`)
  ).toString();
  console.log(result);

  res.json({ data: result });
});

app.get("/games/completed:slug", async (req, res) => {
  const { slug } = req.params;
  const result = (
    await fs.readFile(`public/games/completed/${slug}/Title.txt`)
  ).toString();
  console.log(result);

  res.json({ data: result });
});

app.get("/games/old:slug", async (req, res) => {
  const { slug } = req.params;
  const result = (
    await fs.readFile(`public/games/old/${slug}/Title.txt`)
  ).toString();
  console.log(result);

  res.json({ data: result });
});

app.get("/posts/:slug", async (req, res) => {
  const { slug } = req.params;
  const result = (
    await fs.readFile(`public/posts/${slug}/Title.txt`)
  ).toString();
  console.log(result);

  res.json({ data: result });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
