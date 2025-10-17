import express from "express";
import { PrismaClient } from "./generated/prisma/index.js";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// PUT /movies/:id
app.put("/movies/:id", async (req, res) => {
    const id = Number(req.params.id);

    // Converte release_date, se vier no corpo
    const data = { ...req.body };
    if (data.release_date) {
        data.release_date = new Date(data.release_date);
    }

    try {
        // Verifica se o filme existe
        const movie = await prisma.movie.findUnique({ where: { id } });
        if (!movie) {
            return res.status(404).json({ message: "Filme não encontrado" });
        }

        // Atualiza os campos recebidos
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
        res.status(200).send();
    } catch {
        return res.status(500).send({ message: "Não foi possível remover o filme" });
    }

});

app.listen(port, () => {
    console.log(`Servidor em execução na porta ${port}`);
});

