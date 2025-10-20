import express from "express";
import { PrismaClient } from "./generated/prisma/index.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" with { type: "json" };

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.put("/movies/:id", async (req, res) => {
    const id = Number(req.params.id);

    const data = { ...req.body };
    if (data.release_date) {
        data.release_date = new Date(data.release_date);
    }

    try {

        const movie = await prisma.movie.findUnique({ where: { id } });
        if (!movie) {
            return res.status(404).json({ message: "Filme não encontrado" });
        }

        const updatedMovie = await prisma.movie.update({
            where: { id },
            data,
        });

        return res.status(200).json(updatedMovie);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Falha ao atualizar o registro do filme" });
    }
});

app.delete("/movies/:id", async (req, res) => {
    const id = Number(req.params.id);

    try {
        const movie = await prisma.movie.findUnique({ where: { id } });

        if (!movie) {
            return res.status(404).send({ message: "Filme não encotrado" });
        }

        await prisma.movie.delete({ where: { id } });
        res.status(200).send({ message: "Filme removido com sucesso" });
    } catch {
        return res.status(500).send({ message: "Não foi possível remover o filme" });
    }

});

app.get("/movies/:genreName", async (req, res) => {


    try {
        const moviesFilteredGenreName = await prisma.movie.findMany(({
            include: {
                genres: true,
                languages: true
            },
            where: {
                genres: {
                    name: {
                        equals: req.params.genreName,
                        mode: "insensitive"
                    }
                }
            }
        }));

        res.status(200).send(moviesFilteredGenreName);
    } catch {
        res.status(500).send({ message: "Falha ao filtrar filmes por gênero" });
    }

});

app.listen(port, () => {
    console.log(`Servidor em execução na porta ${port}`);
});

