import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import routes from "./routes";

const app = express();

app.use(express.json());
app.use(routes);

// Qualquer rota que não existe cai aqui
app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});

// Um JSON malformado no corpo é erro de quem enviou (400), não um erro do servidor
app.use((error: Error & { type?: string }, req: Request, res: Response, next: NextFunction) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "O corpo da requisição não é um JSON válido." });
  }

  return next(error);
});

const port = process.env.SERVER_PORT || 3001;

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
