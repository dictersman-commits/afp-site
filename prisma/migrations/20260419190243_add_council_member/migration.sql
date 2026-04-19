-- CreateTable
CREATE TABLE "CouncilMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameRu" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "roleRu" TEXT NOT NULL,
    "roleEn" TEXT NOT NULL,
    "countryRu" TEXT NOT NULL,
    "countryEn" TEXT NOT NULL,
    "bioRu" TEXT,
    "bioEn" TEXT,
    "photo" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "web" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
