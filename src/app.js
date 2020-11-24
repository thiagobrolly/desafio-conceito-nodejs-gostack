const express = require("express");
const cors = require("cors");

const { v4: uuid} = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const {title, url, techs} = req.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return res.json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const {id} = req.params;
  const {title, url, techs} = req.body;

  const findRepoIndex = repositories.findIndex(repository =>
    repository.id === id
  );

  if(findRepoIndex === -1){
    return res.status(400).json({error: 'Repository does not exist.'});
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[findRepoIndex].likes,
  };

  repositories[findRepoIndex] = repository

  return res.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const findRepoIndex = repositories.findIndex(repository =>
    repository.id === id
  );

  if(findRepoIndex >= 0){
    repositories.splice(findRepoIndex, 1);
  }
  else{
    return res.status(400).json({Error: 'Repository does not exist.'});
  }

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const {id} = req.params;

  const findRepoIndex = repositories.findIndex(repository => 
      repository.id === id
  );

  if(findRepoIndex === -1){
    return res.status(400).json({Error: 'Repository does not exists.'});
  }

  repositories[findRepoIndex].likes += 1;

  return res.json(repositories[findRepoIndex]);
});

module.exports = app;
