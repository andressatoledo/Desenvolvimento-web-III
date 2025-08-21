/*
  Warnings:

  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Task";

-- CreateTable
CREATE TABLE "public"."pessoa" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."carro" (
    "id" SERIAL NOT NULL,
    "modelo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,

    CONSTRAINT "carro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pessoa_por_carro" (
    "id" SERIAL NOT NULL,
    "pessoaId" INTEGER NOT NULL,
    "carroId" INTEGER NOT NULL,

    CONSTRAINT "pessoa_por_carro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pessoa_email_key" ON "public"."pessoa"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pessoa_por_carro_pessoaId_carroId_key" ON "public"."pessoa_por_carro"("pessoaId", "carroId");

-- AddForeignKey
ALTER TABLE "public"."pessoa_por_carro" ADD CONSTRAINT "pessoa_por_carro_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "public"."pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pessoa_por_carro" ADD CONSTRAINT "pessoa_por_carro_carroId_fkey" FOREIGN KEY ("carroId") REFERENCES "public"."carro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
