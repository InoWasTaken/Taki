-- CreateTable
CREATE TABLE "User" (
    "discordId" TEXT NOT NULL PRIMARY KEY,
    "ASNGUsername" TEXT NOT NULL,
    "maxPosition" INTEGER NOT NULL DEFAULT 200
);
