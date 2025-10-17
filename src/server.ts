import express from "express";
import { PrismaClient } from "./generated/prisma/index.js";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/movies", async (_, res) => {
    const movies = await prisma.movie.findMany({
        orderBy: {
            title: "asc",
        },
        include: {
            genres: true,
            languages: true
        }
    });

    res.json(movies);
});

app.post("/movies", async (req, res) => {
    const { title, genre_id, language_id, oscar_count, release_date } = req.body;
    try {

        const movieWhiteSameTitle = await prisma.movie.findFirst({
            where: { title: { equals: title, mode: "insensitive" } }
        });

        if (movieWhiteSameTitle) {
            return res.status(409).send({ message: "Já existe um filme cadastrado com este título" });
        }

        await prisma.movie.create({
            data: {
                title,
                genre_id,
                language_id,
                oscar_count,
                release_date: new Date(release_date)
            }
        });
    } catch {
        return res.status(500).send({ message: "Erro ao cadastrar um filme" });
    };
    res.status(201);
});

app.listen(port, () => {
    console.log("Servidor em execução");
});
